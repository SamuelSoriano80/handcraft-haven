import mongoose from "mongoose";

const connectDB = async () => {
  const uriPresent = Boolean(process.env.MONGO_URI);
  console.log("connectDB: mongoose.readyState=", mongoose.connection.readyState, "MONGO_URI present=", uriPresent);

  if (mongoose.connection.readyState >= 1) return;

  if (!uriPresent) {
    const err = new Error("MONGO_URI is not set in environment");
    console.error("connectDB error:", err.message);
    throw err;
  }

  try {
    // Optional: disable strictQuery warnings
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("connectDB: connected to MongoDB, readyState=", mongoose.connection.readyState);
    return conn;
  } catch (error) {
    console.error("connectDB: failed to connect to MongoDB:", error);
    throw error;
  }
};

export default connectDB;

