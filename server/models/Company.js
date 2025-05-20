import mongoose from "mongoose";

// Remove the token field from the schema
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
  primaryColor: { type: String },
  secondaryColor: { type: String },
  backgroundColor: { type: String },
  logo: { type: String },
  representativeName: String,
  token: { type: String },
  tokenExpiry: { type: Date },
});

// Add indexes for frequently queried fields
// companySchema.index({ email: 1 });
companySchema.index({ role: 1 });
companySchema.index({ token: 1 });

export default mongoose.model("Company", companySchema);
