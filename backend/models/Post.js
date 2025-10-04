// // models/Post.js
// import mongoose from "mongoose";

// const postSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },

//   title: {
//     type: String,
//     required: true,
//   },

//   topic: {
//     type: String,
//     default: "General",
//   },

//   viralityScore: {
//     type: Number,
//     default: 0,
//   },

//   content: {
//     type: String,
//     required: true,
//   },

//   image: String,

//   // When the post was created
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },

//   // When it is scheduled to be posted (optional)
//   scheduledTime: {
//     type: Date,
//   },

//   // Status of the post
//   status: {
//     type: String,
//     enum: ["draft", "scheduled", "posted", "failed"],
//     default: "draft", // default for createPost
//   },

//   // LinkedIn specific fields
//   linkedinPostUrn: {
//     type: String,
//   },

//   analytics: {
//     likes: { type: Number, default: 0 },
//     comments: { type: Number, default: 0 },
//     shares: { type: Number, default: 0 },
//     impressions: { type: Number, default: 0 },
//     engagementRate: { type: Number, default: 0 },
//   },
// });

// export default mongoose.model("Post", postSchema);




// backend/models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    topic: { type: String, default: "General" },
    viralityScore: { type: Number, default: 0 },
    content: { type: String, required: true },
    image: String,

    scheduledTime: { type: Date },

    status: {
      type: String,
      enum: ["draft", "scheduled", "posted", "failed"],
      default: "draft",
    },

    linkedinPostUrn: String,

    // ✅ reference to Analytics model
    analytics: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analytics",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
