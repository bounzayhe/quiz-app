import { INSCRIPTION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { client, sender } from "./mailtrap.config.js";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (
  email = "zedbenzu@gmail.com",
  companyId,
  questionnaireId,
  companyName
) => {
  const recipient = [{ email }];
  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Inscription link for your clients.",
      html: INSCRIPTION_EMAIL_TEMPLATE.replace(/{companyName}/g, companyName)
        .replace(/{companyId}/g, companyId)
        .replace(/{questionnaireId}/g, questionnaireId),
    });

    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
};
