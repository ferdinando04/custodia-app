import { Schema, model, models } from "mongoose";

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  businessName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:     { type: String, required: true },
    businessName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;
