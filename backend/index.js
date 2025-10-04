// file: backend/index.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js";
import agenda, { defineAgendaJobs } from "./scheduler/agenda.js";
import User from "./models/User.js"; // your User model

import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/post.js";
import scheduleRoutes from "./routes/post.js";
import analyticsRoutes from "./routes/post.js";
import planRoutes from "./routes/plan.js"
import paymentRoutes from "./routes/payment.js"
import adminRoutes from "./routes/studioAdmin.js";

const app = express();

// -------------------- PASSPORT CONFIG --------------------
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email,
        googleId: profile.id,
        profileImage: profile.photos[0].value
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// ----------------------------------------------------------



// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

// Routes
import googleAuthRoutes from "./routes/googleAuth.js";
app.use("/auth/google", googleAuthRoutes); // Google OAuth routes
app.use("/api", authRoutes);
app.use("/api", blogRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/linkedin", authRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/paymentStatus", paymentRoutes);   
app.use("/api/studioAdmin", adminRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    defineAgendaJobs();
    await agenda.start();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  });
