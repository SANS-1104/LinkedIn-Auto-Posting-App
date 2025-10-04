// file: src/pages/Navbar/AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [profile, setProfile] = useState(null);

  const login = (accessToken, refreshToken, name) => {
    // console.log("🔐 Setting token in localStorage:", accessToken); // ADD THIS
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken); 
    localStorage.setItem("name", name);
    setIsLoggedIn(true);
    setName(name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken"); 
    localStorage.removeItem("name");
    setName("");
    setIsLoggedIn(false);
    setProfile(null);
  };


  useEffect(() => {
    const syncAuth = async () => {
      try {
        const res = await axiosClient.get("/profile");
        if (res?.data) {
          setProfile(res.data);
          setName(res.data.name);
          setIsLoggedIn(true);
        }
      } catch (err) {
        // console.warn("❌ syncAuth failed:", err?.response?.data?.msg || err.message);
        setIsLoggedIn(false);
        setProfile(null);
      }
    };

    const token = localStorage.getItem("token");
    if (token) syncAuth();

    const onStorageChange = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);


  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        name,
        login,
        logout,
        profile, // shared globally now
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
