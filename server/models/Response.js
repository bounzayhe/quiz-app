import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  value: { type: String, required: true, trim: true },
  score: { type: Number, required: true },
  ordre: { type: Number, required: true },
  explication: { type: String, trim: true },
  details: { type: String, trim: true },
  tentative_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tentative",
    required: true,
  },
});

export default mongoose.model("Response", responseSchema);
