// backend/controllers/planController.js
import Plan from "../models/Plan.js";

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public (you can restrict later if needed)
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};
