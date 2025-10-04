// backend/models/Plan.js
import { Schema, model } from "mongoose";

const PlanSchema = new Schema(
  {
    name: {
      type: String,
      enum: ["pro", "advanced", "custom"],
      required: true,
      unique: true,
    },
    monthlyQuota: { type: Number, required: true },
    monthlyPrice: { type: Number, default: 0 }, 
    yearlyPrice: { type: Number, default: 0 }, 
    features: [{ type: String }], // optional, store feature list
  },
  { timestamps: true }
);

export default model("Plan", PlanSchema);
