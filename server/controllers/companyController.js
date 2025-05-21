import Company from "../models/Company.js";
import Tentative from "../models/Tentative.js";
import Questionnaire from "../models/Questionnaire.js";
import Client from "../models/Client.js";
import Response from "../models/Response.js";
import mongoose from "mongoose";

export const getCompaniesWithStats = async (req, res) => {
  try {
    // Verify admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const companies = await Company.aggregate([
      {
        $match: {
          role: "company", // Only include companies with role "company"
        },
      },
      {
        $lookup: {
          from: "questionnaires",
          localField: "_id",
          foreignField: "company_id",
          as: "questionnaires",
        },
      },
      {
        $lookup: {
          from: "tentatives",
          let: { questionnaireIds: "$questionnaires._id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$questionnaire_id", "$$questionnaireIds"],
                },
              },
            },
          ],
          as: "tentatives",
        },
      },
      {
        $project: {
          fullname: 1,
          logo: 1,
          clientCount: { $size: "$tentatives" },
        },
      },
    ]);

    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getQuestionnaireClientsWithResponses = async (req, res) => {
  try {
    // Verify company role
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const companyId = req.user.id;

    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // First get total count for pagination
    const totalCount = await Tentative.countDocuments({
      questionnaire_id: {
        $in: await Questionnaire.find({ company_id: companyId }).distinct(
          "_id"
        ),
      },
    });

    const clients = await Tentative.aggregate([
      {
        $match: {
          questionnaire_id: {
            $in: await Questionnaire.find({ company_id: companyId }).distinct(
              "_id"
            ),
          },
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "client_id",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $lookup: {
          from: "responses",
          localField: "_id",
          foreignField: "tentative_id",
          as: "responses",
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "responses.question_id",
          foreignField: "_id",
          as: "questions",
        },
      },
      {
        $project: {
          "client.fullname": 1,
          score_total: 1,
          questions: {
            $map: {
              input: "$questions",
              as: "q",
              in: {
                question_id: "$$q._id",
                value: "$$q.value",
                type: "$$q.type",
                ordre: "$$q.ordre",
                response: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$responses",
                        as: "r",
                        cond: { $eq: ["$$r.question_id", "$$q._id"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      // Add pagination
      { $skip: skip },
      { $limit: limit },
    ]);

    res.status(200).json({
      data: clients,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching clients with responses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerClient = async (req, res) => {
  try {
    const { companyId, questionnaireId } = req.params;
    const { fullname, email } = req.body;

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Verify questionnaire exists and belongs to company
    const questionnaire = await Questionnaire.findOne({
      _id: questionnaireId,
      company_id: companyId,
    });
    if (!questionnaire) {
      return res.status(404).json({
        success: false,
        message: "Questionnaire not found or doesn't belong to this company",
      });
    }

    // Check if client already exists
    const existingClient = await Client.findOne({
      $or: [
        { company_id: companyId, fullname },
        { company_id: companyId, email },
      ],
    });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client already registered",
        client_id: existingClient._id,
      });
    }

    // Create new client
    const newClient = await Client.create({
      company_id: companyId,
      fullname,
      email,
    });

    // Create a tentative for this client and questionnaire
    const tentative = await Tentative.create({
      client_id: newClient._id,
      questionnaire_id: questionnaireId,
      score_total: 0,
    });

    res.status(201).json({
      success: true,
      message: "Client registered successfully",
      data: {
        client_id: newClient._id,
        tentative_id: tentative._id,
        questionnaire_id: questionnaireId,
        company_id: companyId,
      },
    });
  } catch (error) {
    console.error("Error registering client:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Add this function to your controller
export const createTentative = async (req, res) => {
  try {
    const { client_id, questionnaire_id } = req.body;

    // Check if client already attempted this questionnaire
    const existingAttempt = await Tentative.findOne({
      client_id,
      questionnaire_id,
    });
    if (existingAttempt) {
      return res.status(400).json({
        message: "Client already completed this questionnaire",
        tentative_id: existingAttempt._id,
      });
    }

    const newTentative = await Tentative.create({
      client_id,
      questionnaire_id,
      score_total: 0, // Initialize with 0
    });

    res.status(201).json({
      message: "Questionnaire attempt started",
      tentative_id: newTentative._id,
    });
  } catch (error) {
    console.error("Error creating tentative:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getScoreTrendsOverTime = async (req, res) => {
  try {
    // Verify company role
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const companyId = req.user.id;

    // Get all questionnaires for this company
    const questionnaires = await Questionnaire.find({ company_id: companyId });
    const questionnaireIds = questionnaires.map((q) => q._id);

    const scoreTrends = await Tentative.aggregate([
      {
        $match: {
          questionnaire_id: { $in: questionnaireIds },
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "client_id",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $lookup: {
          from: "questionnaires",
          localField: "questionnaire_id",
          foreignField: "_id",
          as: "questionnaire",
        },
      },
      {
        $unwind: "$client",
      },
      {
        $unwind: "$questionnaire",
      },
      {
        // Group by month and questionnaire
        $group: {
          _id: {
            month: {
              $dateToString: { format: "%Y-%m", date: "$date_passage" },
            },
            questionnaire_id: "$questionnaire_id",
            questionnaire_label: "$questionnaire.label",
          },
          average_score: { $avg: "$score_total" },
          max_score: { $max: "$score_total" },
          min_score: { $min: "$score_total" },
          attempts_count: { $sum: 1 },
          // Keep track of top performers
          top_performers: {
            $push: {
              client_name: "$client.fullname",
              score: "$score_total",
              date: "$date_passage",
            },
          },
        },
      },
      {
        // Sort top performers and keep only top 3
        $project: {
          _id: 1,
          average_score: 1,
          max_score: 1,
          min_score: 1,
          attempts_count: 1,
          top_performers: {
            $slice: [
              {
                $sortArray: {
                  input: "$top_performers",
                  sortBy: { score: -1 },
                },
              },
              3,
            ],
          },
        },
      },
      {
        // Sort by date and questionnaire
        $sort: {
          "_id.month": 1,
          "_id.questionnaire_label": 1,
        },
      },
    ]);

    // Transform the data for easier frontend consumption
    const transformedData = scoreTrends.reduce((acc, item) => {
      const questionnaire = item._id.questionnaire_label;
      if (!acc[questionnaire]) {
        acc[questionnaire] = {
          labels: [],
          averageScores: [],
          maxScores: [],
          minScores: [],
          topPerformers: {},
          attemptsCount: [],
        };
      }

      acc[questionnaire].labels.push(item._id.month);
      acc[questionnaire].averageScores.push(
        Number(item.average_score.toFixed(2))
      );
      acc[questionnaire].maxScores.push(item.max_score);
      acc[questionnaire].minScores.push(item.min_score);
      acc[questionnaire].topPerformers[item._id.month] = item.top_performers;
      acc[questionnaire].attemptsCount.push(item.attempts_count);

      return acc;
    }, {});

    res.status(200).json({
      status: "success",
      data: transformedData,
    });
  } catch (error) {
    console.error("Error fetching score trends:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const calculateClientScores = async (req, res) => {
  try {
    // Verify company role
    if (req.user.role !== "company") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { client_id } = req.params;
    const companyId = req.user.id;

    // First verify that this client belongs to the company
    const client = await Client.findOne({
      _id: client_id,
      company_id: companyId,
    });

    if (!client) {
      return res.status(404).json({
        status: "error",
        message: "Client not found or doesn't belong to your company",
      });
    }

    // Get all attempts by this client
    const clientScores = await Tentative.aggregate([
      {
        $match: {
          client_id: new mongoose.Types.ObjectId(client_id),
        },
      },
      {
        // Get the questionnaire details
        $lookup: {
          from: "questionnaires",
          localField: "questionnaire_id",
          foreignField: "_id",
          as: "questionnaire",
        },
      },
      {
        $unwind: "$questionnaire",
      },
      {
        // Get all sections for this questionnaire
        $lookup: {
          from: "sections",
          localField: "questionnaire_id",
          foreignField: "questionnaire_id",
          as: "sections",
        },
      },
      {
        // Get all responses for this tentative
        $lookup: {
          from: "responses",
          localField: "_id",
          foreignField: "tentative_id",
          as: "responses",
        },
      },
      {
        // Get all questions
        $lookup: {
          from: "questions",
          localField: "responses.question_id",
          foreignField: "_id",
          as: "questions",
        },
      },
      {
        $unwind: "$sections",
      },
      {
        // Calculate scores for each section
        $project: {
          tentative_id: "$_id",
          date_passage: 1,
          section_id: "$sections._id",
          section_label: "$sections.label",
          section_ordre: "$sections.ordre",
          questionnaire_label: "$questionnaire.label",
          questionnaire_id: "$questionnaire._id",
          responses: {
            $filter: {
              input: "$responses",
              as: "response",
              cond: {
                $in: [
                  "$$response.question_id",
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$questions",
                          as: "question",
                          cond: {
                            $eq: ["$$question.section_id", "$sections._id"],
                          },
                        },
                      },
                      as: "question",
                      in: "$$question._id",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        // Calculate section scores
        $project: {
          tentative_id: 1,
          date_passage: 1,
          section_id: 1,
          section_label: 1,
          section_ordre: 1,
          questionnaire_label: 1,
          questionnaire_id: 1,
          section_score: { $sum: "$responses.score" },
          max_possible_score: { $size: "$responses" },
          response_count: { $size: "$responses" },
        },
      },
      {
        // Group by tentative to calculate totals for each attempt
        $group: {
          _id: {
            tentative_id: "$tentative_id",
            questionnaire_id: "$questionnaire_id",
          },
          date_passage: { $first: "$date_passage" },
          questionnaire_label: { $first: "$questionnaire_label" },
          sections: {
            $push: {
              section_id: "$section_id",
              label: "$section_label",
              ordre: "$section_ordre",
              score: "$section_score",
              max_possible_score: "$max_possible_score",
              response_count: "$response_count",
              score_percentage: {
                $multiply: [
                  {
                    $divide: [
                      "$section_score",
                      { $max: ["$max_possible_score", 1] },
                    ],
                  },
                  100,
                ],
              },
            },
          },
          total_score: { $sum: "$section_score" },
          total_possible_score: { $sum: "$max_possible_score" },
          total_responses: { $sum: "$response_count" },
        },
      },
      {
        // Calculate overall scores and sort sections
        $project: {
          _id: 0,
          tentative_id: "$_id.tentative_id",
          questionnaire_id: "$_id.questionnaire_id",
          date_passage: 1,
          questionnaire_label: 1,
          sections: {
            $sortArray: {
              input: "$sections",
              sortBy: { ordre: 1 },
            },
          },
          total_score: 1,
          total_possible_score: 1,
          total_responses: 1,
          overall_score_percentage: {
            $multiply: [
              {
                $divide: [
                  "$total_score",
                  { $max: ["$total_possible_score", 1] },
                ],
              },
              100,
            ],
          },
        },
      },
      {
        // Sort by date, most recent first
        $sort: {
          date_passage: -1,
        },
      },
      {
        // Group all attempts by questionnaire
        $group: {
          _id: "$questionnaire_id",
          questionnaire_label: { $first: "$questionnaire_label" },
          attempts: {
            $push: {
              tentative_id: "$tentative_id",
              date_passage: "$date_passage",
              sections: "$sections",
              total_score: "$total_score",
              total_possible_score: "$total_possible_score",
              total_responses: "$total_responses",
              overall_score_percentage: "$overall_score_percentage",
            },
          },
          average_score: { $avg: "$overall_score_percentage" },
          best_score: { $max: "$overall_score_percentage" },
          attempt_count: { $sum: 1 },
        },
      },
    ]);

    if (!clientScores.length) {
      return res.status(200).json({
        status: "success",
        data: {
          client_name: client.fullname,
          questionnaires: [],
        },
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        client_name: client.fullname,
        questionnaires: clientScores,
      },
    });
  } catch (error) {
    console.error("Error calculating client scores:", error);
    res.status(500).json({ message: "Server error" });
  }
};
