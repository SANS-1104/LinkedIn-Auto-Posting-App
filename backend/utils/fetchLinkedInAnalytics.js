// file: backend/utils/fetchLinkedInAnalytics.js

import axios from "axios";

/**
 * Fetches analytics for a LinkedIn post using its URN.
 */
export const fetchLinkedInAnalytics = async (accessToken, postUrn) => {
  try {
    const encodedUrn = encodeURIComponent(postUrn);

    let analytics = {
      likes: 0,
      comments: 0,
      shares: 0,
      impressions: 0,
      engagementRate: 0,
    };

    console.log("📌 Fetching analytics for:", postUrn);

    if (postUrn.includes("ugcPost")) {
      // For personal profile UGC posts
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202507",
        // for correct version goto: https://learn.microsoft.com/en-us/linkedin/marketing/versioning?view=li-lms-2025-07
      };

      const response = await axios.get(
        `https://api.linkedin.com/rest/creatorStatistics?q=ugcPost&ugcPost=${encodedUrn}`,
        { headers }
      );

      const data = response.data?.value || {};

      const totalEngagements =
        (data.likeCount || 0) + (data.commentCount || 0) + (data.shareCount || 0);
      const impressions = data.impressionCount || 0;
      const engagementRate =
        impressions > 0 ? (totalEngagements / impressions) * 100 : 0;

      analytics = {
        likes: data.likeCount || 0,
        comments: data.commentCount || 0,
        shares: data.shareCount || 0,
        impressions,
        engagementRate: Number(engagementRate.toFixed(2)),
      };
    } else if (postUrn.includes("share")) {
      // For organization or user shares
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202507", // ✅ Fixed version
        "X-Restli-Protocol-Version": "2.0.0",
      };

      const response = await axios.get(
        `https://api.linkedin.com/rest/socialActions/${encodedUrn}`,
        { headers }
      );

      const data = response.data || {};

      const totalEngagements =
        (data.likesSummary?.totalLikes || 0) +
        (data.commentsSummary?.count || 0) +
        (data.sharesSummary?.count || 0);
      const impressions = data.impressionSummary?.impressionsCount || 0;
      const engagementRate =
        impressions > 0 ? (totalEngagements / impressions) * 100 : 0;

      analytics = {
        likes: data.likesSummary?.totalLikes || 0,
        comments: data.commentsSummary?.count || 0,
        shares: data.sharesSummary?.count || 0,
        impressions,
        engagementRate: Number(engagementRate.toFixed(2)),
      };
    } else {
      throw new Error("❌ Invalid URN format. Must include ugcPost or share.");
    }

    return analytics;
  } catch (err) {
    const errorMsg = err.response?.data || err.message;
    console.error("❌ LinkedIn Analytics Fetch Error:", errorMsg);
    throw new Error("Unable to fetch LinkedIn analytics");
  }
};
