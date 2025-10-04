// scheduler/agenda.js

import dotenv from "dotenv";
dotenv.config();

import Agenda from "agenda";
import Post from "../models/Post.js"; // ✅ unified model
import User from "../models/User.js";
import { postToLinkedIn } from "../utils/postToLinkedIn.js";

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "scheduledJobs" },
});

// ✅ Register jobs
export const defineAgendaJobs = () => {
  agenda.define("post scheduled blog", async (job) => {
    const { blogId } = job.attrs.data;
    console.log(`⏰ Agenda triggered job for postId: ${blogId}`);

    const post = await Post.findById(blogId);
    if (!post) return console.log("❌ Post not found for scheduled job");
    if (post.status === "posted") return console.log("⚠️ Already posted");

    const user = await User.findById(post.user);
    if (!user) return console.log("❌ User not found");

    try {
      await postToLinkedIn(user, {
        title: post.title,
        content: post.content,
        image: post.image,
      });

      post.status = "posted";
      await post.save();
      console.log(`✅ Scheduled post "${post.title}" posted.`);
    } catch (err) {
      post.status = "failed";
      await post.save();
      console.error("❌ LinkedIn post failed:", err.message);
    }
  });
};

export default agenda;
