import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err?.isOperational) {
    res.status(err.statusCode).json({
      status: err.message,
      message: err.message,
    });
  } else {
    console.log("Error 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    sendErrorProd(error, res);
  }
};
