import { Schema, model, Document, Types } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = model<UserDocument>("User", userSchema);
