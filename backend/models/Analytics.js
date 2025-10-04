// backend/models/Analytics.js
import { Schema, model } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      unique: true, // one analytics record per post
    },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model("Analytics", AnalyticsSchema);
