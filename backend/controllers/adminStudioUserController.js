import User from "../models/User.js";
import Plan from "../models/Plan.js";

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("subscriptionPlan", "name price monthlyQuota");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE user subscription/status/role
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { subscriptionPlan, subscriptionStatus, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (subscriptionPlan) {
      const plan = await Plan.findById(subscriptionPlan);
      if (!plan) return res.status(400).json({ error: "Invalid plan" });
      user.subscriptionPlan = plan._id;
      user.monthlyQuota = plan.monthlyQuota;
      user.usageCount = 0;
    }

    if (subscriptionStatus) user.subscriptionStatus = subscriptionStatus;
    if (role) user.role = role;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
