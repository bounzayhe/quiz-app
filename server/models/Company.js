import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  fullname: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  industry_type: { type: String, trim: true },
  link: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "company"],
    default: "company",
  },
  token: {
    type: String,
    default: null,
  },
});

export default mongoose.model("Company", companySchema);
