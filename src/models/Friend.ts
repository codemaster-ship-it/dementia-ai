import mongoose, { Schema, Document } from "mongoose";

export interface IFriend extends Document {
  name: string;
  personality: string;
  voiceId: string;
  avatarUrl?: string;
  createdAt: Date;
}

const FriendSchema = new Schema<IFriend>({
  name: { type: String, required: true },
  personality: { type: String, required: true },
  voiceId: { type: String, required: true },
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Friend || mongoose.model<IFriend>("Friend", FriendSchema);
