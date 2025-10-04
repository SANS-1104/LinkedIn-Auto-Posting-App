// // ✅ controllers/draftController.js

// import Post from "../models/Post.js"; // ✅ Use unified model

// // Get all unscheduled drafts
// export const getDrafts = async (req, res) => {
//   try {
//     // ✅ Fetch all drafts from unified Post collection
//     const drafts = await Post.find({
//       user: req.user.id,
//       $or: [
//         { status: "draft" },     // explicitly marked as draft
//         { scheduledTime: null }  // not yet scheduled
//       ]
//     });

//     res.status(200).json(drafts);
//   } catch (err) {
//     console.error("Error fetching drafts:", err);
//     res.status(500).json({ error: "Failed to fetch drafts" });
//   }
// };

// // Update draft with scheduledTime when dropped on calendar
// export const scheduleDraft = async (req, res) => {
//   try {
//     const { scheduledTime } = req.body;

//     const updatedDraft = await Post.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       {
//         scheduledTime,
//         status: "scheduled" // ✅ mark as scheduled
//       },
//       { new: true }
//     );

//     res.status(200).json(updatedDraft);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to schedule draft" });
//   }
// };

// // Create a new draft (unscheduled post)
// export const createDraft = async (req, res) => {
//   try {
//     const { title, content, image, topic, viralityScore } = req.body;

//     if (!title || !content) {
//       return res.status(400).json({ error: "Title and content are required" });
//     }

//     const draft = await Post.create({
//       user: req.user.id,
//       title,
//       content,
//       topic: topic || "General",
//       image,
//       scheduledTime: null, // ✅ mark as draft
//       status: "draft",      // ✅ clearly marked as draft
//       viralityScore : Number(viralityScore)
//     });

//     res.status(201).json(draft);
//   } catch (err) {
//     console.error("Error creating draft:", err);
//     res.status(500).json({ error: "Failed to create draft" });
//   }
// };

// // ✅ Unschedule a scheduled post and move it to draft
// export const moveToDraft = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await Post.findOneAndUpdate(
//       { _id: id, user: req.user.id },
//       {
//         scheduledTime: null,
//         status: "draft" // ✅ helpful for filtering
//       }
//     );

//     res.status(200).json({ message: "Post moved to draft" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to unschedule post" });
//   }
// };



import Post from "../models/Post.js";
import User from "../models/User.js";

// ------------------ Get all unscheduled drafts ------------------
export const getDrafts = async (req, res) => {
  try {
    const drafts = await Post.find({
      user: req.user.id,
      $or: [{ status: "draft" }, { scheduledTime: null }],
    }).sort({ createdAt: -1 });

    res.status(200).json(drafts);
  } catch (err) {
    console.error("Error fetching drafts:", err);
    res.status(500).json({ error: "Failed to fetch drafts" });
  }
};

// ------------------ Create a new draft ------------------
export const createDraft = async (req, res) => {
  try {
    const { title, content, image, topic, viralityScore } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const user = await User.findById(req.user.id);

    // ---- SaaS subscription check ----
    // if (user.subscriptionStatus !== "active") {
    //   return res.status(403).json({ error: "Subscription inactive. Please renew your plan." });
    // }
    // if (user.usageCount >= user.monthlyQuota) {
    //   return res.status(403).json({ error: "Monthly quota exceeded. Upgrade your plan to continue posting." });
    // }

    const draft = await Post.create({
      user: req.user.id,
      title,
      content,
      topic: topic || "General",
      image,
      scheduledTime: null,
      status: "draft",
      viralityScore: Number(viralityScore) || 0,
    });

    // ---- Increment usage count ----
    user.usageCount += 1;
    await user.save();

    res.status(201).json(draft);
  } catch (err) {
    console.error("Error creating draft:", err);
    res.status(500).json({ error: "Failed to create draft" });
  }
};

// ------------------ Schedule a draft ------------------
export const scheduleDraft = async (req, res) => {
  try {
    const { scheduledTime } = req.body;

    const draft = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { scheduledTime, status: "scheduled" },
      { new: true }
    );

    if (!draft) return res.status(404).json({ error: "Draft not found" });

    res.status(200).json(draft);
  } catch (err) {
    console.error("Failed to schedule draft:", err);
    res.status(500).json({ error: "Failed to schedule draft" });
  }
};

// ------------------ Move scheduled post back to draft ------------------
export const moveToDraft = async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { scheduledTime: null, status: "draft" },
      { new: true }
    );

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.status(200).json({ message: "Post moved to draft", post });
  } catch (err) {
    console.error("Failed to move post to draft:", err);
    res.status(500).json({ error: "Failed to move post to draft" });
  }
};
