import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    fullname: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
