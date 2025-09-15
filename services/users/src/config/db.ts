import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO URI not found in env environment");
    }
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("Database Connected 😀");
    });
  } catch (err) {
    console.error("MongoDB connection failed: ", err);
    process.exit(1);
  }
};

export default connectDB;
