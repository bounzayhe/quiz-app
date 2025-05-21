import Questionnaire from "../models/Questionnaire.js";
import Section from "../models/Section.js";
import Question from "../models/Question.js";
import Response from "../models/Response.js";
import Company from "../models/Company.js";
import { generateToken } from "../utils/token.js";
import { APIError } from "../middlewares/errorMiddleware.js";
import mongoose from "mongoose";
import { sendEmail } from "../mailtrap/emails.js";

export const generateSurvey = async (req, res) => {
  try {
    const { companyInfo, sections } = req.body;
    const adminId = req.user._id;

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin users can create questionnaires",
      });
    }

    // First, create or update the company
    const company = await Company.findOneAndUpdate(
      { email: companyInfo.email },
      {
        fullname: companyInfo.name,
        email: companyInfo.email,
        phoneNumber: companyInfo.phoneNumber,
        representativeName: companyInfo.representativeName,
        logo: companyInfo.logo,
        primaryColor: companyInfo.primaryColor,
        secondaryColor: companyInfo.secondaryColor,
        backgroundColor: companyInfo.backgroundColor,
        role: "company", // Set default role
      },
      { upsert: true, new: true }
    );

    // Create the questionnaire
    const questionnaire = await Questionnaire.create({
      company_id: company._id,
      label: companyInfo.name + "'s Questionnaire",
    });

    // Create sections and questions
    for (let i = 0; i < sections.length; i++) {
      const sectionData = sections[i];

      // Create section
      const section = await Section.create({
        questionnaire_id: questionnaire._id,
        label: sectionData.title,
        ordre: i + 1,
        picture: sectionData.image || null,
      });

      // Create questions for this section
      for (let j = 0; j < sectionData.questions.length; j++) {
        const questionData = sectionData.questions[j];

        // Create question
        const question = await Question.create({
          section_id: section._id,
          type: questionData.type,
          ordre: j + 1,
          value: questionData.title,
        });

        // If it's a radio type question, store the possible responses
        if (questionData.type === "radio" && questionData.answers) {
          const responsePromises = questionData.answers.map((answerData, k) => {
            return Response.create({
              question_id: question._id,
              value: answerData.text,
              score: answerData.score,
              ordre: k + 1,
              explication: answerData.explanation || null,
              details: answerData.detail || null,
              tentative_id: null, // This will be set when a client takes the questionnaire
            });
          });

          await Promise.all(responsePromises);
        }
      }
    }

    // Generate a unique access token for this questionnaire
    const accessToken = generateToken();

    // Input string containing a single ObjectId
    // Get raw hex strings directly from MongoDB ObjectIds
    const companyId = company._id.toString();
    const questionnaireId = questionnaire._id.toString();

    await sendEmail(
      companyInfo.email,
      companyId, // Now a clean hex string like "682ceb5a515e7624721f6e67"
      questionnaireId,
      companyInfo.name
    );

    // Generate the registration link that includes both questionnaire ID and access token
    const registrationLink = `${process.env.FRONTEND_URL}/register/${questionnaire._id}?token=${accessToken}`;

    res.status(201).json({
      success: true,
      message: "Questionnaire generated successfully",
      data: {
        company: {
          id: company._id,
          name: company.fullname,
          email: company.email,
        },
        questionnaire: {
          id: questionnaire._id,
          label: questionnaire.label,
          registrationLink,
          accessToken,
        },
      },
    });
  } catch (error) {
    console.error("Error generating questionnaire:", error);
    res.status(500).json({
      success: false,
      message: "Error generating questionnaire",
      error: error.message,
    });
  }
};

export const getAllSurveys = async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== "admin") {
      throw new APIError("Only admin users can view surveys", 403);
    }

    const { companyId } = req.query;

    // Build the match stage for aggregation
    const matchStage = companyId ? { company_id: companyId } : {};

    // Get questionnaires with their related data
    const questionnaires = await Questionnaire.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "companies",
          localField: "company_id",
          foreignField: "_id",
          as: "company",
        },
      },
      {
        $unwind: "$company",
      },
      {
        $lookup: {
          from: "sections",
          localField: "_id",
          foreignField: "questionnaire_id",
          as: "sections",
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "sections._id",
          foreignField: "section_id",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "responses",
          localField: "questions._id",
          foreignField: "question_id",
          as: "responses",
        },
      },
      {
        $project: {
          _id: 1,
          label: 1,
          company: {
            _id: 1,
            fullname: 1,
            email: 1,
            logo: 1,
            primaryColor: 1,
            secondaryColor: 1,
            backgroundColor: 1,
          },
          sections: {
            $map: {
              input: "$sections",
              as: "section",
              in: {
                _id: "$$section._id",
                label: "$$section.label",
                ordre: "$$section.ordre",
                picture: "$$section.picture",
                questions: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$questions",
                        as: "q",
                        cond: { $eq: ["$$q.section_id", "$$section._id"] },
                      },
                    },
                    as: "question",
                    in: {
                      _id: "$$question._id",
                      type: "$$question.type",
                      value: "$$question.value",
                      ordre: "$$question.ordre",
                      responses: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$responses",
                              as: "r",
                              cond: {
                                $eq: ["$$r.question_id", "$$question._id"],
                              },
                            },
                          },
                          as: "response",
                          in: {
                            _id: "$$response._id",
                            value: "$$response.value",
                            score: "$$response.score",
                            ordre: "$$response.ordre",
                            explication: "$$response.explication",
                            details: "$$response.details",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: questionnaires,
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error fetching surveys",
    });
  }
};

export const updateSurvey = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { companyInfo, sections } = req.body;

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      throw new APIError("Only admin users can update surveys", 403);
    }

    // Find the questionnaire
    const questionnaire = await Questionnaire.findById(surveyId);
    if (!questionnaire) {
      throw new APIError("Questionnaire not found", 404);
    }

    // Update company information if provided
    if (companyInfo) {
      await Company.findByIdAndUpdate(questionnaire.company_id, {
        fullname: companyInfo.name,
        email: companyInfo.email,
        phoneNumber: companyInfo.phoneNumber,
        representativeName: companyInfo.representativeName,
        logo: companyInfo.logo,
        primaryColor: companyInfo.primaryColor,
        secondaryColor: companyInfo.secondaryColor,
        backgroundColor: companyInfo.backgroundColor,
      });
    }

    // Update sections and questions if provided
    if (sections) {
      // Delete existing sections and their related questions and responses
      const existingSections = await Section.find({
        questionnaire_id: surveyId,
      });
      const sectionIds = existingSections.map((section) => section._id);

      await Question.deleteMany({ section_id: { $in: sectionIds } });
      await Section.deleteMany({ questionnaire_id: surveyId });

      // Create new sections and questions
      for (let i = 0; i < sections.length; i++) {
        const sectionData = sections[i];

        // Create section
        const section = await Section.create({
          questionnaire_id: surveyId,
          label: sectionData.title,
          ordre: i + 1,
          picture: sectionData.image || null,
        });

        // Create questions for this section
        for (let j = 0; j < sectionData.questions.length; j++) {
          const questionData = sectionData.questions[j];

          // Create question
          const question = await Question.create({
            section_id: section._id,
            type: questionData.type,
            ordre: j + 1,
            value: questionData.title,
          });

          // If it's a radio type question, store the possible responses
          if (questionData.type === "radio" && questionData.answers) {
            const responsePromises = questionData.answers.map(
              (answerData, k) => {
                return Response.create({
                  question_id: question._id,
                  value: answerData.text,
                  score: answerData.score,
                  ordre: k + 1,
                  explication: answerData.explanation || null,
                  details: answerData.detail || null,
                });
              }
            );

            await Promise.all(responsePromises);
          }
        }
      }
    }

    // Get the updated questionnaire with all its related data
    const updatedQuestionnaire = await Questionnaire.findById(surveyId)
      .populate({
        path: "company_id",
        select:
          "fullname email logo primaryColor secondaryColor backgroundColor",
      })
      .populate({
        path: "sections",
        populate: {
          path: "questions",
          populate: {
            path: "responses",
          },
        },
      });

    res.status(200).json({
      success: true,
      message: "Questionnaire updated successfully",
      data: updatedQuestionnaire,
    });
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error updating survey",
    });
  }
};

export const getQuestionnaireSection = async (req, res) => {
  try {
    const { questionnaireId, sectionId } = req.params;

    // Find the questionnaire and verify it exists
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      throw new APIError("Questionnaire not found", 404);
    }

    // Get the specific section with its questions and responses
    const section = await Section.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(sectionId),
          questionnaire_id: new mongoose.Types.ObjectId(questionnaireId),
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "section_id",
          as: "questions",
        },
      },
      {
        $lookup: {
          from: "responses",
          let: { questionIds: "$questions._id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$question_id", "$$questionIds"] },
              },
            },
          ],
          as: "responses",
        },
      },
      {
        $project: {
          _id: 1,
          label: 1,
          ordre: 1,
          picture: 1,
          questions: {
            $map: {
              input: "$questions",
              as: "question",
              in: {
                _id: "$$question._id",
                type: "$$question.type",
                value: "$$question.value",
                ordre: "$$question.ordre",
                responses: {
                  $filter: {
                    input: "$responses",
                    as: "response",
                    cond: { $eq: ["$$response.question_id", "$$question._id"] },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    if (!section || section.length === 0) {
      throw new APIError("Section not found", 404);
    }

    res.status(200).json({
      success: true,
      data: section[0],
    });
  } catch (error) {
    console.error("Error fetching questionnaire section:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error fetching questionnaire section",
    });
  }
};

// Add a function to get section list
export const getQuestionnaireSections = async (req, res) => {
  try {
    const { questionnaireId } = req.params;

    // Find the questionnaire and verify it exists
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      throw new APIError("Questionnaire not found", 404);
    }

    // Get all sections for this questionnaire
    const sections = await Section.find({ questionnaire_id: questionnaireId })
      .select("_id label ordre picture")
      .sort({ ordre: 1 });

    res.status(200).json({
      success: true,
      data: sections,
    });
  } catch (error) {
    console.error("Error fetching questionnaire sections:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error fetching questionnaire sections",
    });
  }
};
