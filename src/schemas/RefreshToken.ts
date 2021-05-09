import { model, Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IRefreshToken extends Document {
  refreshToken: string;
  user: IUser;
}

const refreshTokenSchema = new Schema({
  refreshToken: { type: String, unique: true, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
