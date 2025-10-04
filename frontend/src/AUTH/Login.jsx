import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css"
import axiosClient from "../api/axiosClient";
import { toast } from 'react-toastify';
import { FaArrowRight } from "react-icons/fa";
import { AuthContext } from "../Navbar/AuthContext";


const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post("/login", formData);
      const { accessToken, refreshToken, name } = res.data;

      // ✅ Save tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // ✅ Call login context
      login(accessToken, name);

      toast.success("Logged In Successfully", {
        autoClose: 1000,
      });

      navigate(`/dashboard/${name}`);
    } catch (err) {
      console.log(`Login failed : ${err}`);
      
      toast.error("Login failed", {
        autoClose: 1000,
      });
    }
  };


  return (
    <div className="login-outer-wrapper ">
      <div className="goToHome">
        <a href="/">Go To Home <span className="arrow-icon"><FaArrowRight /></span> </a>
      </div>
      <div className="login-inner-wrapper ">
        <div className="login-header">
          <div className="login-title">Sign In</div>
          <div className="login-subhead">
            <div className="a">New User?</div>
            <div className="b"> <a href="/signup">Sign Up</a> </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-box">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-box">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>

          {/* <button 
            type="submit"
            className="w-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:brightness-110 transition-all duration-300"
          >
            Login
          </button> */}

          <button type="submit">Login</button>


        </form>
      </div>
    </div>
  );
};

export default Login;
