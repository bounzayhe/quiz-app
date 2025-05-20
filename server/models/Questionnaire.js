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

// Add index for company_id which is frequently used in lookups
questionnaireSchema.index({ company_id: 1 });

export default mongoose.model("Questionnaire", questionnaireSchema);
