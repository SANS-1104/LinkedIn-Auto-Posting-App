import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Navbar/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import { Button } from "./ui/button";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.info("Please log in first!", { autoClose: 1500 });
      navigate("/auth");
      return;
    }

    const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));
    if (!selectedPlan) {
      toast.error("No plan selected", { autoClose: 1500 });
      navigate("/");
      return;
    }
    setPlan(selectedPlan);
  }, [isLoggedIn, navigate]);

  const handlePayment = async () => {
    try {
      // call backend API to process payment
      const res = await axiosClient.post("/plans/subscribe", {
        userId: user.id,
        planId: plan._id,
        paymentStatus: "success", // simulate success for now
      });

      localStorage.removeItem("selectedPlan");
      toast.success("Payment successful! Redirecting to dashboard...", { autoClose: 1500 });
      navigate(`/dashboard/${user.name}`);
    } catch (err) {
      toast.error("Payment failed", { autoClose: 1500 });
      console.error(err);
    }
  };

  if (!plan) return null;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Checkout</h2>
      <p className="mb-2">Plan: {plan.name}</p>
      <p className="mb-4">Price: ${plan.price}</p>
      <Button onClick={handlePayment} className="bg-green-600 hover:bg-green-700 text-white">
        Pay Now
      </Button>
    </div>
  );
}
