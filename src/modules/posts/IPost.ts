import { Document } from "mongoose";
import User from "../users/UserType";

export default interface IPost extends Document {
  title: string;
  content: string;
  likes?: number;
  creator: User;
  isActive: boolean;
  removedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
