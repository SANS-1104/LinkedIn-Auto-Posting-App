import { useEffect, useState, useContext } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import { AuthContext } from "../../Navbar/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosClient.get("/plans"); // ✅ use axiosClient
        setPlans(res.data); // Axios puts JSON in res.data
      } catch (err) {
        console.error("Failed to fetch plans", err);
      }
    };
    fetchPlans();
  }, []);

  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChoosePlan = (plan) => {
    if (!isLoggedIn) {
      toast.info("Please log in first!", { autoClose: 1500 });
      return;
    }
    localStorage.setItem("selectedPlan", JSON.stringify(plan));
    navigate("/checkout");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Upgrade when you're ready to scale
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              onClick={() => setIsYearly(false)}
              className={`cursor-pointer px-4 py-2 rounded-md border transition-all duration-300 
                ${!isYearly ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
            >
              Monthly
            </span>
            <span
              onClick={() => setIsYearly(true)}
              className={`cursor-pointer px-4 py-2 rounded-md border flex items-center transition-all duration-300
                ${isYearly ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}
            >
              Yearly
            </span>
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
              Save up to 17%
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <Card key={index} className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
                {index === 1 && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl text-gray-900">
                      ${price}
                    </span>
                    <span className="text-gray-600">
                      {price > 0 ? (isYearly ? "/year" : "/month") : ""}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    {plan.description || "Best for scaling your LinkedIn growth"}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white`}
                    onClick={() => handleChoosePlan(plan)}
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
