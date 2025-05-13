import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["radio", "text"],
    },
    ordre: { type: Number, required: true },
    value: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
