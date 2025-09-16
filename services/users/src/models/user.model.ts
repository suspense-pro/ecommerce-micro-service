import { Schema } from "mongoose";
import bcrypt from "bcryptjs";
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  passwordChangedAt: Date;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
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
