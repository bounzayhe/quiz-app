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
    ordre: { type: Number, required: false },
    value: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Add index for frequently queried fields
questionSchema.index({ section_id: 1 });
questionSchema.index({ ordre: 1 });

export default mongoose.model("Question", questionSchema);
