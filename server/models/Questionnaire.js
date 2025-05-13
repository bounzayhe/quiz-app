import mongoose from "mongoose";

const questionnaireSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    label: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Questionnaire", questionnaireSchema);
