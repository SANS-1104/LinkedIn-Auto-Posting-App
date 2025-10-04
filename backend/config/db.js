// config/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");``
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// This code connects to a MongoDB database using Mongoose.
// It exports a function that attempts to connect to the database using the connection string stored in the `MONGO_URI` environment variable.
// If the connection is successful, it logs a success message; if it fails, it logs an error message and exits the process with a failure code.
// Make sure to set the `MONGO_URI` environment variable in your .env file or environment before running your application.
// This is essential for the application to function correctly, as it relies on a database connection for storing and retrieving data.
// Ensure you have the `mongoose` package installed in your project to use this code.