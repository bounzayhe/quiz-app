import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    questionnaire_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questionnaire",
      required: true,
    },
    label: { type: String, required: true, trim: true },
    ordre: { type: Number, required: true },
    picture: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Section", sectionSchema);
