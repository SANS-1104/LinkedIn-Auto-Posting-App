// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("📩 Incoming authHeader:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("authMiddleware error: Missing or invalid auth header");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  // console.log("🔐 Incoming token:", token); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.error("authMiddleware error: JWT expired");
      return res.status(401).json({ msg: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      console.error("authMiddleware error: JWT malformed");
      return res.status(401).json({ msg: "JWT malformed" });
    } else {
      console.error("authMiddleware error:", err.message);
      return res.status(401).json({ msg: "Invalid token" });
    }
  }
};

export default authMiddleware;
