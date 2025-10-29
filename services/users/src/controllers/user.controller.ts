import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { User } from "../models/user.model";
import AppError from "../utils/appError";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();


const cookieOptions = {
  httpOnly: false,
  secure: process.env.environment === "production",
  sameSite: "strict" as const,
};

const sendTokens = (
  res: Response,
  user: any,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userData = user.toObject();
  delete userData.password;

  res.status(200).json({
    status: "success",
    message: "Authentication Successfull",
    user: userData,
  });
};

export const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new AppError("Email already exists", 400));
    }

    if (!username || !email || !password) {
      return next(
        new AppError("Username, email, and password are required", 400)
      );
    }

    const user = await User.create({ username, email, password });
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateAccessToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    sendTokens(res, user, accessToken, refreshToken);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("email or password missing", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Invalid credentails", 401));
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendTokens(res, user, accessToken, refreshToken);
  }
);

export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new AppError("Refresh token missing", 401));
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return next(new AppError("Invalid refresh token", 403));
    }

    // verify refresh token
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string
    );
    if (user._id?.toString() !== decoded.id) {
      return next(new AppError("Token does not match user", 403));
    }

    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      status: "success",
      message: "Tokens refreshed successfully",
    });
  }
);
