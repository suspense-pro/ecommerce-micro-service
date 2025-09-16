import express, { NextFunction, Request, Response } from "express";
import AppError from "./utils/appError";
import { globalErrorHandler } from "./middlewares/errorHandler";

import userRoutes from "./routes/user.route";

const app = express();

// body parser
app.use(express.json());

// routes
app.use("/api/v1/users", userRoutes);

// handle undefined routes

// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });
app.use(globalErrorHandler);

export default app;
