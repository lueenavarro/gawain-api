import { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  verified: boolean;
}

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

export const User = model<IUser>("User", userSchema);
