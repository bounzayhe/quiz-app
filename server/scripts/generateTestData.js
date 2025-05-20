import mongoose from "mongoose";
import dotenv from "dotenv";
import Company from "../models/Company.js";
import Questionnaire from "../models/Questionnaire.js";
import Section from "../models/Section.js";
import Question from "../models/Question.js";
import Response from "../models/Response.js";
import Client from "../models/Client.js";
import Tentative from "../models/Tentative.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const generateTestData = async () => {
  try {
    // Clear existing data
    await Promise.all([
      Company.deleteMany({}),
      Questionnaire.deleteMany({}),
      Section.deleteMany({}),
      Question.deleteMany({}),
      Response.deleteMany({}),
      Client.deleteMany({}),
      Tentative.deleteMany({}),
    ]);

    console.log("Cleared existing data");

    // Create admin user
    const admin = await Company.create({
      fullname: "Admin User",
      email: "admin@example.com",
      password: "admin123", // Plain text password for testing
      role: "admin",
      phoneNumber: "+1234567890",
      representativeName: "John Admin",
    });

    console.log("Created admin user");

    // Create 4 companies with different themes
    const companyThemes = [
      {
        name: "Tech Solutions Inc",
        theme: {
          primaryColor: "#2563eb",
          secondaryColor: "#60a5fa",
          backgroundColor: "#f8fafc",
        },
      },
      {
        name: "Green Energy Co",
        theme: {
          primaryColor: "#059669",
          secondaryColor: "#34d399",
          backgroundColor: "#f0fdf4",
        },
      },
      {
        name: "Creative Design Studio",
        theme: {
          primaryColor: "#db2777",
          secondaryColor: "#f472b6",
          backgroundColor: "#fdf2f8",
        },
      },
      {
        name: "Financial Services Ltd",
        theme: {
          primaryColor: "#7c3aed",
          secondaryColor: "#a78bfa",
          backgroundColor: "#f5f3ff",
        },
      },
    ];

    const companies = await Promise.all(
      companyThemes.map(async (companyData, index) => {
        return Company.create({
          fullname: companyData.name,
          email: `company${index + 1}@example.com`,
          password: "company123", // Plain text password for testing
          role: "company",
          phoneNumber: `+1987654321${index}`,
          representativeName: `Jane Manager ${index + 1}`,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            companyData.name
          )}&background=random`,
          primaryColor: companyData.theme.primaryColor,
          secondaryColor: companyData.theme.secondaryColor,
          backgroundColor: companyData.theme.backgroundColor,
        });
      })
    );

    console.log("Created companies");

    // Create questionnaires for each company
    const questionnaireData = [
      {
        title: "Employee Satisfaction Survey",
        sections: [
          {
            title: "Work Environment",
            questions: [
              {
                title: "How satisfied are you with your work environment?",
                type: "radio",
                answers: [
                  { text: "Very Satisfied", score: 5 },
                  { text: "Satisfied", score: 4 },
                  { text: "Neutral", score: 3 },
                  { text: "Dissatisfied", score: 2 },
                  { text: "Very Dissatisfied", score: 1 },
                ],
              },
              {
                title: "What improvements would you suggest?",
                type: "text",
              },
            ],
          },
          {
            title: "Professional Development",
            questions: [
              {
                title: "How would you rate the training opportunities?",
                type: "radio",
                answers: [
                  { text: "Excellent", score: 5 },
                  { text: "Good", score: 4 },
                  { text: "Average", score: 3 },
                  { text: "Poor", score: 2 },
                  { text: "Very Poor", score: 1 },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Customer Feedback Survey",
        sections: [
          {
            title: "Product Quality",
            questions: [
              {
                title: "How would you rate our product quality?",
                type: "radio",
                answers: [
                  {
                    text: "Excellent",
                    score: 5,
                    explanation: "Exceeds expectations",
                  },
                  { text: "Good", score: 4, explanation: "Meets expectations" },
                  {
                    text: "Average",
                    score: 3,
                    explanation: "Room for improvement",
                  },
                  { text: "Poor", score: 2, explanation: "Below expectations" },
                  {
                    text: "Very Poor",
                    score: 1,
                    explanation: "Significant issues",
                  },
                ],
              },
            ],
          },
          {
            title: "Customer Service",
            questions: [
              {
                title: "Rate your experience with our customer service",
                type: "radio",
                answers: [
                  { text: "Excellent", score: 5 },
                  { text: "Good", score: 4 },
                  { text: "Average", score: 3 },
                  { text: "Poor", score: 2 },
                  { text: "Very Poor", score: 1 },
                ],
              },
              {
                title: "Any additional comments about our service?",
                type: "text",
              },
            ],
          },
        ],
      },
    ];

    // Create questionnaires and their related data for each company
    for (const company of companies) {
      // Create test clients for this company
      const clients = await Promise.all([
        Client.create({
          company_id: company._id,
          fullname: "Test Client 1",
        }),
        Client.create({
          company_id: company._id,
          fullname: "Test Client 2",
        }),
      ]);

      // Each company gets both questionnaire types
      for (const template of questionnaireData) {
        const questionnaire = await Questionnaire.create({
          company_id: company._id,
          label: `${company.fullname} - ${template.title}`,
        });

        // Create tentatives for each client
        const tentatives = await Promise.all(
          clients.map((client) =>
            Tentative.create({
              client_id: client._id,
              questionnaire_id: questionnaire._id,
              score_total: Math.floor(Math.random() * 100), // Random score for testing
            })
          )
        );

        // Create sections
        for (let i = 0; i < template.sections.length; i++) {
          const sectionTemplate = template.sections[i];
          const section = await Section.create({
            questionnaire_id: questionnaire._id,
            label: sectionTemplate.title,
            ordre: i + 1,
            picture: null,
          });

          // Create questions
          for (let j = 0; j < sectionTemplate.questions.length; j++) {
            const questionTemplate = sectionTemplate.questions[j];
            const question = await Question.create({
              section_id: section._id,
              type: questionTemplate.type,
              ordre: j + 1,
              value: questionTemplate.title,
            });

            // Create responses for radio questions
            if (questionTemplate.type === "radio" && questionTemplate.answers) {
              // Create responses for each tentative
              for (const tentative of tentatives) {
                // Randomly select one answer for each question
                const randomAnswerIndex = Math.floor(
                  Math.random() * questionTemplate.answers.length
                );
                const answer = questionTemplate.answers[randomAnswerIndex];

                await Response.create({
                  question_id: question._id,
                  value: answer.text,
                  score: answer.score,
                  ordre: randomAnswerIndex + 1,
                  explication: answer.explanation || null,
                  details: null,
                  tentative_id: tentative._id,
                });
              }
            }
          }
        }
      }
    }

    console.log(
      "Created questionnaires with sections, questions, and responses"
    );

    // Log summary
    console.log("\nTest Data Summary:");
    console.log("- Admin user created (admin@example.com / admin123)");
    console.log("- 4 companies created with themed questionnaires");
    console.log("- 2 clients created per company");
    console.log("- Test responses generated for each client");
  } catch (error) {
    console.error("Error generating test data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
generateTestData();
