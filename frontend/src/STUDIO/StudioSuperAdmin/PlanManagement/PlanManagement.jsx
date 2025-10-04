import React, { useEffect, useState } from "react";
import { Button } from "../../LANDING-PAGE/ui/button";
import axiosClient from "../../../api/axiosClient";
import { toast } from "react-toastify";


const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    name: "",
    monthlyPrice: "",
    yearlyPrice: "",
    monthlyQuota: "",
    features: [""], // ✅ start with one empty feature
  });
  const [loading, setLoading] = useState(true);

  // Fetch plans from backend
  const fetchPlans = async () => {
    try {
      const res = await axiosClient.get("/studioAdmin/plans");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching plans");
    } finally {
      setLoading(false);
    }
  };

  // Add new plan
  const addPlan = async () => {
    try {
      await axiosClient.post("/studioAdmin/plans", newPlan);
      setNewPlan({ name: "", monthlyPrice: "", yearlyPrice : "",  monthlyQuota: "", features: [""] });
      toast.success("Plan Added Successfully");
      fetchPlans();
    } catch (err) {
      console.error(err);
      toast.error("Error adding plan");
    }
  };

  // Delete plan
  const deletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await axiosClient.delete(`/studioAdmin/plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting plan");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <p>Loading plans...</p>;

  // Add feature to new plan
  const addFeatureField = () => {
    setNewPlan({ ...newPlan, features: [...newPlan.features, ""] });
  };

  // Update feature in new plan
  const updateFeature = (index, value) => {
    const features = [...newPlan.features];
    features[index] = value;
    setNewPlan({ ...newPlan, features });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Plan Management</h1>

      {/* Add new plan form */}
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Plan name"
            className="border p-2 rounded"
            value={newPlan.name}
            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded"
            value={newPlan.price}
            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Monthly quota"
            className="border p-2 rounded"
            value={newPlan.monthlyQuota}
            onChange={(e) =>
              setNewPlan({ ...newPlan, monthlyQuota: e.target.value })
            }
          />
          <Button onClick={addPlan}>Add Plan</Button>
        </div>

        {/* Features inputs */}
        <div className="flex gap-2 flex-wrap">
          {newPlan.features.map((f, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Feature ${idx + 1}`}
              className="border p-2 rounded"
              value={f}
              onChange={(e) => updateFeature(idx, e.target.value)}
            />
          ))}
          <Button size="sm" onClick={addFeatureField}>
            + Add Feature
          </Button>
        </div>
      </div>

      {/* Plans table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Monthly Price</th>
            <th className="p-2 border">Yearly Price</th>
            <th className="p-2 border">Monthly Quota</th>
            <th className="p-2 border">Features</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((p) => (
            <tr key={p._id} className="border">
              <td className="p-2 border">
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) =>
                    setPlans(
                      plans.map((plan) =>
                        plan._id === p._id
                          ? { ...plan, name: e.target.value }
                          : plan
                      )
                    )
                  }
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={p.monthlyPrice}
                  onChange={(e) =>
                    setPlans(
                      plans.map((plan) =>
                        plan._id === p._id
                          ? { ...plan, monthlyPrice: e.target.value }
                          : plan
                      )
                    )
                  }
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={p.yearlyPrice}
                  onChange={(e) =>
                    setPlans(
                      plans.map((plan) =>
                        plan._id === p._id
                          ? { ...plan, yearlyPrice: e.target.value }
                          : plan
                      )
                    )
                  }
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={p.monthlyQuota}
                  onChange={(e) =>
                    setPlans(
                      plans.map((plan) =>
                        plan._id === p._id
                          ? { ...plan, monthlyQuota: e.target.value }
                          : plan
                      )
                    )
                  }
                  className="border p-1 rounded w-full"
                />
              </td>
              <td className="p-2 border">
                {p.features?.map((f, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={f}
                    onChange={(e) =>
                      setPlans(
                        plans.map((plan) =>
                          plan._id === p._id
                            ? {
                                ...plan,
                                features: plan.features.map((feat, i) =>
                                  i === idx ? e.target.value : feat
                                ),
                              }
                            : plan
                        )
                      )
                    }
                    className="border p-1 rounded w-full mb-1"
                  />
                ))}
              </td>
              <td className="p-2 border flex gap-2">
                <Button
                  size="sm"
                  onClick={async () => {
                    try {
                      await axiosClient.put(`/studioAdmin/plans/${p._id}`, {
                        name: p.name,
                        monthlyPrice: p.monthlyPrice,
                        yearlyPrice: p.yearlyPrice,
                        monthlyQuota: p.monthlyQuota,
                        features: p.features,
                      });
                      toast.success("Plan updated!");
                      fetchPlans();
                    } catch (err) {
                      console.error(err);
                      toast.error("Error updating plan");
                    }
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deletePlan(p._id)}
                  className="text-red-500"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanManagement;
