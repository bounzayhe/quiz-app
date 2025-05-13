import mongoose from "mongoose";

const tentativeSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    questionnaire_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questionnaire",
      required: true,
    },
    score_total: { type: Number, required: true },
    date_passage: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Tentative", tentativeSchema);
