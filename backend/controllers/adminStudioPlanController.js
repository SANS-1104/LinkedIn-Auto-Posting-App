import Plan from "../models/Plan.js";

// GET all plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);    
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE plan
export const createPlan = async (req, res) => {
  try {
    const { name, monthlyPrice, yearlyPrice,  monthlyQuota, features } = req.body;
    const plan = new Plan({ name, monthlyPrice, yearlyPrice,  monthlyQuota, features });
    await plan.save();
    res.json({ message: "Plan created", plan });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
    console.log(err);
    
  }
};

// UPDATE plan
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Plan.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: "Plan updated", updated });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE plan
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    await Plan.findByIdAndDelete(id);
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
