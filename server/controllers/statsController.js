import Company from "../models/Company.js";
import { APIError } from "../middlewares/errorMiddleware.js";

export const getCompanyStats = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new APIError("Unauthorized access", 403);
    }

    const companies = await Company.aggregate([
      {
        $match: {
          role: "company",
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
    ]).hint({ role: 1 }); // Use the index we created

    res.status(200).json(companies);
  } catch (error) {
    next(error);
  }
};

import Company from "../models/Company.js";
import { asyncHandler } from "../middlewares/errorMiddleware.js";

export const getCompanyStatsDetailed = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new APIError("Unauthorized access", 403);
  }

  const companies = await Company.aggregate([
    {
      $match: {
        role: "company",
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
  ]).hint({ role: 1 }); // Use the index we created

  res.status(200).json(companies);
});

import Company from "../models/Company.js";
import { asyncHandler } from "../middlewares/errorMiddleware.js";

export const getCompaniesWithStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new APIError("Unauthorized access", 403);
  }

  const companies = await Company.aggregate([
    {
      $match: {
        role: "company",
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
  ]).hint({ role: 1 }); // Use the index we created

  res.status(200).json(companies);
});
