import Company from "../models/Company.js";
import Tentative from "../models/Tentative.js";
import Questionnaire from "../models/Questionnaire.js";
import Client from "../models/Client.js";
import Response from "../models/Response.js";

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
        $project: {
          fullname: 1,
          logo: 1,
          _id: 1,
        },
      },
      {
        $lookup: {
          from: "tentatives",
          localField: "_id",
          foreignField: "questionnaire_id",
          as: "tentatives",
        },
      },
      {
        $addFields: {
          clientCount: { $size: "$tentatives" },
        },
      },
      {
        $project: {
          fullname: 1,
          logo: 1,
          clientCount: 1,
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
    ]);

    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients with responses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerClient = async (req, res) => {
  try {
    const { company_id, fullname } = req.body;

    // Check if client already exists
    const existingClient = await Client.findOne({ company_id, fullname });
    if (existingClient) {
      return res.status(400).json({
        message: "Client already registered",
        client_id: existingClient._id,
      });
    }

    // Create new client
    const newClient = await Client.create({
      company_id,
      fullname,
    });

    res.status(201).json({
      message: "Client registered successfully",
      client_id: newClient._id,
    });
  } catch (error) {
    console.error("Error registering client:", error);
    res.status(500).json({ message: "Server error" });
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
