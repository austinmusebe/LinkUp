import mongoose from "mongoose";
import { INTEREST_CATEGORIES } from "./User";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  location: String,
  categories: [{ type: String, enum: INTEREST_CATEGORIES }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Event = mongoose.model("Event", eventSchema);
