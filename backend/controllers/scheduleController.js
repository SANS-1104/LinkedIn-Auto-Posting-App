//   // file: controllers/scheduleController.js

//   import Post from "../models/Post.js"; // ✅ Unified model
//   import agenda from "../scheduler/agenda.js";

//   // ✅ Schedule new LinkedIn post
//   export const scheduleLinkedInPost = async (req, res) => {
//     try {
//       const { title, content, image, scheduledTime } = req.body;
//       const userId = req.user.id;

//       const post = await Post.create({
//         user: userId,
//         title,
//         content,
//         image,
//         scheduledTime,
//         status: "scheduled" // ✅ clearly mark as scheduled
//       });

//       // Schedule job in Agenda
//       const localDate = new Date(scheduledTime);
//       if (isNaN(localDate.getTime())) {
//         throw new Error("Invalid scheduled time format");
//       }

//       await agenda.schedule(localDate, "post scheduled blog", {
//         blogId: post._id.toString()
//       });

//       res.json({ success: true, post });
//     } catch (err) {
//       console.error("❌ Schedule error:", err.message);
//       res.status(500).json({ error: "Failed to schedule LinkedIn post" });
//     }
//   };

//   // ✅ Get all scheduled posts
//   export const getScheduledPosts = async (req, res) => {
//     try {
//       const posts = await Post.find({
//         user: req.user.id,
//         status: "scheduled"
//       }).sort({ scheduledTime: 1 });

//       res.json(posts);
//     } catch (err) {
//       res.status(500).json({ error: "Failed to fetch scheduled posts" });
//     }
//   };

//   // ✅ Cancel/Delete scheduled post
//   export const cancelScheduledPost = async (req, res) => {
//     try {
//       const post = await Post.findOneAndUpdate(
//         { _id: req.params.id, user: req.user.id },
//         { scheduledTime: null, status: "draft" }, // ✅ move back to draft
//         { new: true }
//       );

//       if (!post) return res.status(404).json({ error: "Post not found" });

//       // Cancel agenda job if any
//       await agenda.cancel({ "data.blogId": post._id.toString() });

//       res.json({ message: "Scheduled post cancelled successfully", post });
//     } catch (err) {
//       res.status(500).json({ error: "Failed to cancel post" });
//     }
//   };

//   // ✅ Edit scheduled post
//   export const updateScheduledPost = async (req, res) => {
//     try {
//       const { title, content, image, scheduledTime, topic } = req.body;
//       const userId = req.user.id;
//       const postId = req.params.id;

//       const post = await Post.findOne({ _id: postId, user: userId });
//       if (!post) return res.status(404).json({ error: "Post not found" });

//       // Prevent editing if already posted
//       if (post.status === "posted") {
//         return res.status(400).json({ error: "Cannot edit a posted post" });
//       }

//       // Update fields
//       post.title = title || post.title;
//       post.content = content || post.content;
//       post.topic = topic || post.topic;
//       post.image = image || post.image;
//       post.scheduledTime = scheduledTime || post.scheduledTime;
//       post.status = "scheduled"; // always set to scheduled
     

//       await post.save();

//       // Cancel old job
//       await agenda.cancel({ "data.blogId": post._id.toString() });

//       // Schedule new job
//       await agenda.schedule(new Date(post.scheduledTime), "post scheduled blog", {
//         blogId: post._id.toString()
//       });

//       res.json({ message: "Post updated successfully", post });
//     } catch (err) {
//       console.error("Edit error:", err.message);
//       res.status(500).json({ error: "Failed to update post" });
//     }
//   };

// // When posting, set status to posted and prevent further changes
// // export const markPostAsPosted = async (postId) => {
// //   const post = await Post.findById(postId);
// //   if (post && post.status === "scheduled") {
// //     post.status = "posted";
// //     await post.save();
// //   }
// //   // If already posted, do nothing
// // };

// // ✅ Get best posting time
// export const getBestPostTime = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const posts = await Post.find({ user: userId });

//     if (!posts.length) {
//       return res.json({
//         dailyBest: {},
//         weeklyTop3: [
//           { key: "Tuesday-10", avg: 0 },
//           { key: "Wednesday-10", avg: 0 },
//           { key: "Thursday-10", avg: 0 }
//         ]
//       });
//     }

//     const engagementByHour = {};

//     posts.forEach((post) => {
//       const localTime = new Date(post.createdAt);
//       const day = localTime.toLocaleString("en-US", { weekday: "long" });
//       const hour = localTime.getHours();
//       const key = `${day}-${hour}`;

//       // Engagement score from analytics
//       const engagementScore =
//         (post.analytics?.likes || 0) +
//         (post.analytics?.comments || 0) +
//         (post.analytics?.shares || 0);

//       // ✅ Fallback: If no engagement, give a score of 1 so frequency still counts
//       const score = engagementScore > 0 ? engagementScore : 1;

//       if (!engagementByHour[key]) {
//         engagementByHour[key] = { count: 0, total: 0 };
//       }

//       engagementByHour[key].count += 1;
//       engagementByHour[key].total += score;
//     });

//     // Sort by average engagement score
//     const sorted = Object.entries(engagementByHour)
//       .map(([key, val]) => ({
//         key,
//         avg: val.total / val.count
//       }))
//       .sort((a, b) => b.avg - a.avg);

//     // ✅ Top 3 best times overall
//     const weeklyTop3 = sorted.slice(0, 3);

//     // ✅ Best time for each day
//     const dailyBest = {};
//     sorted.forEach(({ key, avg }) => {
//       const [day] = key.split("-");
//       if (!dailyBest[day]) {
//         dailyBest[day] = { key, avg };
//       }
//     });

//     res.json({ dailyBest, weeklyTop3 });
//   } catch (err) {
//     console.error("getBestPostTime error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


import Post from "../models/Post.js";
import User from "../models/User.js";
import agenda from "../scheduler/agenda.js";

// ------------------ Schedule a new LinkedIn post ------------------
export const scheduleLinkedInPost = async (req, res) => {
  try {
    const { title, content, image, scheduledTime, topic, viralityScore } = req.body;
    const user = await User.findById(req.user.id);

    // ---- SaaS subscription check ----
    if (user.subscriptionStatus !== "active") {
      return res.status(403).json({ error: "Subscription inactive. Please renew your plan." });
    }
    if (user.usageCount >= user.monthlyQuota) {
      return res.status(403).json({ error: "Monthly quota exceeded. Upgrade your plan to continue posting." });
    }

    // ---- Create scheduled post ----
    const post = await Post.create({
      user: req.user.id,
      title,
      content,
      image,
      topic: topic || "General",
      viralityScore: Number(viralityScore) || 0,
      scheduledTime,
      status: "scheduled",
    });

    // ---- Increment usage count ----
    user.usageCount += 1;
    await user.save();

    // ---- Schedule job in Agenda ----
    const localDate = new Date(scheduledTime);
    if (isNaN(localDate.getTime())) {
      throw new Error("Invalid scheduled time format");
    }

    await agenda.schedule(localDate, "post scheduled blog", {
      blogId: post._id.toString(),
    });

    res.json({ success: true, post });
  } catch (err) {
    console.error("Schedule error:", err.message);
    res.status(500).json({ error: "Failed to schedule LinkedIn post" });
  }
};

// ------------------ Get all scheduled posts ------------------
export const getScheduledPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.user.id,
      status: "scheduled",
    }).sort({ scheduledTime: 1 });

    res.json(posts);
  } catch (err) {
    console.error("Failed to fetch scheduled posts:", err);
    res.status(500).json({ error: "Failed to fetch scheduled posts" });
  }
};

// ------------------ Cancel/Delete a scheduled post ------------------
export const cancelScheduledPost = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { scheduledTime: null, status: "draft" },
      { new: true }
    );

    if (!post) return res.status(404).json({ error: "Post not found" });

    // Cancel Agenda job if exists
    await agenda.cancel({ "data.blogId": post._id.toString() });

    res.json({ message: "Scheduled post cancelled successfully", post });
  } catch (err) {
    console.error("Failed to cancel post:", err);
    res.status(500).json({ error: "Failed to cancel scheduled post" });
  }
};

// ------------------ Update scheduled post ------------------
export const updateScheduledPost = async (req, res) => {
  try {
    const { title, content, image, scheduledTime, topic, viralityScore } = req.body;
    const user = await User.findById(req.user.id);
    const postId = req.params.id;

    const post = await Post.findOne({ _id: postId, user: req.user.id });
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.status === "posted") {
      return res.status(400).json({ error: "Cannot edit a posted post" });
    }

    // ---- SaaS subscription & quota check for edits (if scheduling new time) ----
    if (scheduledTime && user.usageCount >= user.monthlyQuota) {
      return res.status(403).json({ error: "Monthly quota exceeded. Upgrade your plan to schedule more posts." });
    }

    // ---- Update fields ----
    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image || post.image;
    post.topic = topic || post.topic;
    post.viralityScore = Number(viralityScore) || post.viralityScore;
    post.scheduledTime = scheduledTime || post.scheduledTime;
    post.status = "scheduled";

    await post.save();

    // Cancel old job
    await agenda.cancel({ "data.blogId": post._id.toString() });

    // Schedule new job
    await agenda.schedule(new Date(post.scheduledTime), "post scheduled blog", {
      blogId: post._id.toString(),
    });

    res.json({ message: "Scheduled post updated successfully", post });
  } catch (err) {
    console.error("Failed to update scheduled post:", err);
    res.status(500).json({ error: "Failed to update scheduled post" });
  }
};


// ✅ Get best posting time
export const getBestPostTime = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ user: userId });

    if (!posts.length) {
      return res.json({
        dailyBest: {},
        weeklyTop3: [
          { key: "Tuesday-10", avg: 0 },
          { key: "Wednesday-10", avg: 0 },
          { key: "Thursday-10", avg: 0 }
        ]
      });
    }

    const engagementByHour = {};

    posts.forEach((post) => {
      const localTime = new Date(post.createdAt);
      const day = localTime.toLocaleString("en-US", { weekday: "long" });
      const hour = localTime.getHours();
      const key = `${day}-${hour}`;

      // Engagement score from analytics
      const engagementScore =
        (post.analytics?.likes || 0) +
        (post.analytics?.comments || 0) +
        (post.analytics?.shares || 0);

      // ✅ Fallback: If no engagement, give a score of 1 so frequency still counts
      const score = engagementScore > 0 ? engagementScore : 1;

      if (!engagementByHour[key]) {
        engagementByHour[key] = { count: 0, total: 0 };
      }

      engagementByHour[key].count += 1;
      engagementByHour[key].total += score;
    });

    // Sort by average engagement score
    const sorted = Object.entries(engagementByHour)
      .map(([key, val]) => ({
        key,
        avg: val.total / val.count
      }))
      .sort((a, b) => b.avg - a.avg);

    // ✅ Top 3 best times overall
    const weeklyTop3 = sorted.slice(0, 3);

    // ✅ Best time for each day
    const dailyBest = {};
    sorted.forEach(({ key, avg }) => {
      const [day] = key.split("-");
      if (!dailyBest[day]) {
        dailyBest[day] = { key, avg };
      }
    });

    res.json({ dailyBest, weeklyTop3 });
  } catch (err) {
    console.error("getBestPostTime error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};