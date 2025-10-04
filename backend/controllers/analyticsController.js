// File: controllers/analyticsController.js

import Post from "../models/Post.js";
import { fetchLinkedInAnalytics } from "../utils/fetchLinkedInAnalytics.js";

// ✅ Controller to update blog analytics from LinkedIn
export const updateBlogAnalytics = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { blogId, postUrn } = req.body;

    if (!blogId || !postUrn) {
      return res.status(400).json({ error: "Missing blogId or postUrn" });
    }

    const blog = await Post.findOne({ _id: blogId, user: userId });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found or unauthorized" });
    }

    const accessToken = req.user?.linkedinAccessToken;
    if (!accessToken) {
      return res.status(403).json({ error: "LinkedIn access token missing" });
    }

    // 🔄 Fetch analytics from LinkedIn
    const analytics = await fetchLinkedInAnalytics(accessToken, postUrn);

    blog.analytics = {
      likes: analytics.likes,
      comments: analytics.comments,
      shares: analytics.shares,
      impressions: analytics.impressions,
      engagementRate: analytics.engagementRate || 0,
    };

    await blog.save();

    return res.status(200).json({
      success: true,
      analytics: blog.analytics,
      message: "Analytics updated successfully"
    });

  } catch (err) {
    console.error("❌ Error updating analytics:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to update blog analytics" });
  }
};
