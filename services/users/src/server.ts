import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();

connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}... 🚀`);
});