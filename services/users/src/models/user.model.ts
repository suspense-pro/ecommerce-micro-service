import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  resetPasswordToken?: string;
  passwordChangedAt: Date;
  resetPasswordExpire: Date;
  matchPassword: any;
  refreshToken?: string;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema: Schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "A user must have a username"],
    },

    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "A user must have password"],
      minLength: 8,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  if (typeof this.password === "string") {
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  return resetToken;
};

userSchema.methods.generateAccessToken = function () {
  const expiresIn: any = process.env.JWT_ACCESS_EXPIRE || "15m";
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  const expiresIn: any = process.env.JWT_REFRESH_EXPIRE || "7d";
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET as Secret,
    { expiresIn }
  );
};

export const User = mongoose.model<IUser>("User", userSchema);
