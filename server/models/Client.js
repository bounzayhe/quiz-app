import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// Add compound index for company_id and email
clientSchema.index({ company_id: 1, email: 1 }, { unique: true });

export default mongoose.model("Client", clientSchema);
