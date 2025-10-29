import express from "express";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.route";
import { globalErrorHandler } from "./middlewares/errorHandler";

const app = express();

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// routes
app.use("/api/v1/products", productRoutes);

app.use(globalErrorHandler);

export default app;
