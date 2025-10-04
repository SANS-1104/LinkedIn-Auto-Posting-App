// backend/middleware/quotaMiddleware.js

import User from "../models/User.js";

export const checkQuota = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("subscriptionPlan");

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Check subscription status
    if (user.subscriptionStatus !== "active") {
      return res.status(403).json({ msg: "Subscription inactive. Upgrade to continue." });
    }

    // Reset monthly quota if last reset was before current month
    const now = new Date();
    if (
      !user.lastQuotaReset ||
      user.lastQuotaReset.getMonth() !== now.getMonth() ||
      user.lastQuotaReset.getFullYear() !== now.getFullYear()
    ) {
      user.usageCount = 0;
      user.lastQuotaReset = now;
      await user.save();
    }

    const quota = user.monthlyQuota || 5; // default for free/trial users
    if (user.usageCount >= quota) {
      return res.status(403).json({
        msg: `Monthly quota reached (${quota} posts allowed for your plan)`
      });
    }

    req.user = user; // attach populated user
    next();
  } catch (err) {
    console.error("Quota check error:", err);
    res.status(500).json({ msg: "Server error in quota check" });
  }
};
