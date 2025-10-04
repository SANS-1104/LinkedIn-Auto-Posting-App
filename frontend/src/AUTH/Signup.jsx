import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { toast } from 'react-toastify';
import { FaArrowRight } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/signup", formData);
      toast.success('Signed Up Successfully!', {
        autoClose: 1000
      })
      navigate("/login");
    } catch (err) {
      toast.error("Signup failed", {
        autoClose: 1000
      });
    }
  };

  return (
    <div className="login-outer-wrapper">
      <div className="goToHome">
        <a href="/">Go To Home <span className="arrow-icon"><FaArrowRight /></span> </a>
      </div>
      <div className="login-inner-wrapper">
        <div className="login-header">
          <div className="login-title">Sign Up</div>
          <div className="login-subhead">
            <div className="a">Existing User?</div>
            <div className="b"> <a href="/login">Login</a> </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-box">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your Name"
              onChange={handleChange}
              required
            />
          </div>

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

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
