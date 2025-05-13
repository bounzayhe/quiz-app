import mongoose from "mongoose";
import dotenv from "dotenv";
import Company from "./models/Company.js";
import Client from "./models/Client.js";
import Questionnaire from "./models/Questionnaire.js";
import Section from "./models/Section.js";
import Question from "./models/Question.js";
import Tentative from "./models/Tentative.js";
import Response from "./models/Response.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function createTestData() {
  try {
    // Clear existing data
    await mongoose.connection.dropDatabase();

    // Create companies
    const adminCompany = await Company.create({
      fullname: "Admin Corp",
      email: "admin@test.com",
      password: "admin123",
      role: "admin",
      logo: "https://example.com/admin-logo.png",
      industry_type: "Administration",
      phoneNumber: "1234567890",
    });

    const regularCompany = await Company.create({
      fullname: "Regular Company",
      email: "company@test.com",
      password: "company123",
      role: "company",
      logo: "https://example.com/company-logo.png",
      industry_type: "Technology",
      phoneNumber: "0987654321",
    });

    // Create questionnaire for regular company
    const questionnaire = await Questionnaire.create({
      company_id: regularCompany._id,
      label: "Customer Satisfaction Survey",
    });

    // Create sections
    const section1 = await Section.create({
      questionnaire_id: questionnaire._id,
      label: "Product Feedback",
      ordre: 1,
      picture: "https://example.com/product-icon.png",
    });

    const section2 = await Section.create({
      questionnaire_id: questionnaire._id,
      label: "Service Feedback",
      ordre: 2,
    });

    // Create questions
    const question1 = await Question.create({
      section_id: section1._id,
      type: "radio",
      ordre: 1,
      value: "How satisfied are you with our product?",
    });

    const question2 = await Question.create({
      section_id: section1._id,
      type: "text",
      ordre: 2,
      value: "What can we improve?",
    });

    const question3 = await Question.create({
      section_id: section2._id,
      type: "radio",
      ordre: 1,
      value: "How would you rate our customer service?",
    });

    // Create clients
    const client1 = await Client.create({
      company_id: regularCompany._id,
      fullname: "John Smith",
    });

    const client2 = await Client.create({
      company_id: regularCompany._id,
      fullname: "Jane Doe",
    });

    // Create tentatives
    const tentative1 = await Tentative.create({
      client_id: client1._id,
      questionnaire_id: questionnaire._id,
      score_total: 85,
    });

    const tentative2 = await Tentative.create({
      client_id: client2._id,
      questionnaire_id: questionnaire._id,
      score_total: 72,
    });

    // Create responses
    await Response.create([
      {
        question_id: question1._id,
        tentative_id: tentative1._id, // Add this line
        value: "Very satisfied",
        score: 40,
        ordre: 1,
      },
      {
        question_id: question2._id,
        tentative_id: tentative1._id, // Add this line
        value: "Better documentation",
        score: 30,
        ordre: 2,
      },
      {
        question_id: question3._id,
        tentative_id: tentative2._id, // Add this line
        value: "Excellent",
        score: 45,
        ordre: 1,
      },
    ]);

    console.log("Test data created successfully!");
    console.log({
      adminCompanyId: adminCompany._id,
      regularCompanyId: regularCompany._id,
      questionnaireId: questionnaire._id,
      clientIds: [client1._id, client2._id],
    });
  } catch (error) {
    console.error("Error creating test data:", error);
  } finally {
    mongoose.disconnect();
  }
}

createTestData();
