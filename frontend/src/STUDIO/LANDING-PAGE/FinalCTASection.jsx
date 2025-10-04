import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Navbar/AuthContext";
import React, { useContext } from "react";
import axiosClient from "../../api/axiosClient";

export function FinalCTASection({ onScrollToPricing }) {
  const navigate = useNavigate();
  const { isLoggedIn, name } = useContext(AuthContext);

  const handleLogin = async () => {
    if (isLoggedIn) {
      try {
        const { data } = await axiosClient.get("/paymentStatus");
        
        if (data.status === "active") {
          navigate(`/dashboard/${name}`);
        } else {
          onScrollToPricing?.();
        }
      } catch (err) {
        console.error("Error checking payment status", err);
        onScrollToPricing?.(); // fallback to pricing
      }
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl mb-6 text-white leading-tight">
            Start scheduling smarter today.
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of professionals who've transformed their LinkedIn presence. 
            No credit card required to get started.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={handleLogin}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-blue-100 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Free forever plan
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              No credit card required
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Setup in under 2 minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
