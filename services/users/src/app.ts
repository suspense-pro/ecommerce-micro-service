import express, { NextFunction, Request, Response } from "express";
import { globalErrorHandler } from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

import userRoutes from "./routes/user.route";

dotenv.config();


const app = express();

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());
// routes
app.use("/api/v1/users", userRoutes);

// handle undefined routes

// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });
app.use(globalErrorHandler);

export default app;
