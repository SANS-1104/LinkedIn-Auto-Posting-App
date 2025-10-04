// file: backend/controllers/authController.js

import { hash as _hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// POST /signup
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hash = await _hash(password, 10);
    const newUser = new User({ name, email, password: hash });
    await newUser.save();

    res.status(201).json({ msg: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m", // Short-lived
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Long-lived
    });

    res.json({
      accessToken,
      refreshToken,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /refresh-token
export async function refreshToken(req, res) {
  const { token } = req.body;
  if (!token) return res.status(401).json({ msg: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ msg: "Invalid or expired refresh token" });
  }
}


// GET /profile
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
    // console.log(user);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUT /preference (for auto-post toggle)
export async function updatePreference(req, res) {
  const { autoPostToLinkedIn } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { autoPostToLinkedIn },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateProfile (req,res) {
  const userId = req.user.id; // comes from authMiddleware
  const { firstName, lastName, jobPost } = req.body;

  try {
    // Merge first and last name into a single name field for DB
    const fullName = `${firstName || ""} ${lastName || ""}`.trim();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: fullName,
        jobPost: jobPost || "",
      },
      { new: true } // return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

// logout api
// export async function logout(req, res) {
//   // If storing refresh token later: delete it from DB
//   res.status(200).json({ msg: "Logged out" });
// }