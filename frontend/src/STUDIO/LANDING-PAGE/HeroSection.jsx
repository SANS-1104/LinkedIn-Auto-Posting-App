import React, { useContext } from "react";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Navbar/AuthContext";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";


export function HeroSection({ onScrollToPricing }) {
  const navigate = useNavigate();
  const { isLoggedIn, name } = useContext(AuthContext);
  const handleLogin = async () => {
    if (!isLoggedIn) {
      // Not logged in → go to auth
      navigate("/auth");
      return;
    }

    try {
      // Logged in → check payment status
      const res = await axiosClient.get("/paymentStatus");
      const { status } = res.data;      

      if (status === "active") {
        // User has an active plan → dashboard
        navigate(`/dashboard/${name}`);
      } else {
        // User logged in but no active plan → pricing section
        onScrollToPricing?.();
      }
    } catch (err) {
      console.error("Error fetching payment status:", err);
      onScrollToPricing?.();
    }
  };
  const { logout: authLogout } = useContext(AuthContext);
  const handleLogout = () => {
      authLogout();
      toast.success('Logged Out Successfully', { autoClose: 1000 });
      navigate('/');
      window.dispatchEvent(new Event("storage"));
    };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Grow on LinkedIn, Effortlessly.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Generate, schedule, and post LinkedIn blogs with AI — and track how they perform. All in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleLogin}
            >
              Start Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 hover:border-blue-400 px-8 py-3 rounded-xl transition-all duration-300"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
            {(isLoggedIn) && <Button
              variant="outline"
              size="lg"
              className="border-2 border-gray-300 hover:border-red-400 px-8 py-3 rounded-xl transition-all duration-300"
              onClick={handleLogout}
            >
              Logout
            </Button>}
          </div>

          <p className="text-sm text-gray-500 mb-12">
            Trusted by 500+ professionals
          </p>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&crop=entropy&auto=format&q=80"
                alt="LinkedIn Blog Scheduler Dashboard"
                className="w-full h-96 object-cover rounded-xl"
              />
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full opacity-15 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
