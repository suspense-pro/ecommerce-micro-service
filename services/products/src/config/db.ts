import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const URI = process?.env?.MONGO_URI;
  if (!URI) {
    console.error("MONGO URI not found in env environment");
    process.exit(1);
  }
  try {
    await mongoose.connect(URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Database Connected 😀");
  } catch (err) {
    console.error("MongoDB connection failed: ", err);
    process.exit(1);
  }
};

export default connectDB;
