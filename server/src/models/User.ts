import mongoose from "mongoose";

export const INTEREST_CATEGORIES = [
  "Tech & Development",
  "Business & Entrepreneurship",
  "Design & Creative",
  "Networking & Professional",
  "Social & Meetups",
  "Sports & Fitness",
  "Arts & Culture",
  "Music & Entertainment",
  "Education & Learning",
  "Health & Wellness",
  "Gaming & Esports",
  "Food & Dining",
] as const;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  interests: [{ type: String, enum: INTEREST_CATEGORIES }],
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
