// backend/models/Payment.js
import { Schema, model } from "mongoose";

const PaymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  status: { type: String, enum: ["none","pending", "active"], default: "none" },
  method: { type: String, enum: ["stripe", "paypal", "manual"], default: "stripe" },
  stripePaymentId: { type: String },
  validUntil: { type: Date }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export default model("Payment", PaymentSchema);
