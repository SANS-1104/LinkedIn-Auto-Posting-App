// backend/models/Notification.js
import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["quota", "subscription", "analytics", "general"], required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  data: { type: Object }, // optional: store extra metadata
  createdAt: { type: Date, default: Date.now }
});

export default model("Notification", NotificationSchema);
