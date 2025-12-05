import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import { Event } from "./models/Event.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/linkup";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await User.deleteMany({});
    await Event.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Create Users
    const users = await User.insertMany([
      {
        name: "Austin",
        email: "austin@test.com",
        password: hashedPassword,
        interests: ["Sports & Fitness"],
      },
      {
        name: "AnalyticsCLUB Johannesburg",
        email: "info@analyticsclub.com",
        password: hashedPassword,
        interests: ["Tech & Development"],
      },
      {
        name: "Founders Running Club Nairobi",
        email: "run@foundersclub.ke",
        password: hashedPassword,
        interests: ["Sports & Fitness"],
      },
      {
        name: "Atlassian Community Nairobi",
        email: "nairobi@atlassian-community.com",
        password: hashedPassword,
        interests: ["Tech & Development"],
      },
      {
        name: "Nairobi Startup Founder 101",
        email: "hello@startup101.ke",
        password: hashedPassword,
        interests: ["Business & Entrepreneurship"],
      },
    ]);

    const dummyEvents = [
      {
        title: "AnalyticsCLUB JobExpo",
        description: "Virtual Business, Data & Technology Job Expo",
        date: new Date("2026-01-01T11:00:00"),
        location: "Online Event",
        categories: ["Networking & Professional"],
        createdBy: users[1]._id,
        image: "/images/analytics-club.jpg",
      },
      {
        title: "12 Week AWS Workshop Challenge",
        description: "Level up your skills in AWS Cloud.",
        date: new Date("2025-12-06T12:00:00"),
        location: "Online",
        categories: ["Tech & Development"],
        createdBy: users[1]._id,
        image: "/images/aws-challenge.jpg",
      },
      {
        title: "Founders Running Club",
        description: "Weekly easy runs and networking.",
        date: new Date("2025-12-06T11:00:00"),
        location: "Karura Forest",
        categories: ["Sports & Fitness"],
        createdBy: users[2]._id,
        image: "/images/founders-running.jpg",
      },
      {
        title: "Atlassian Community Event",
        description: "Design thinking methodologies.",
        date: new Date("2025-12-13T15:00:00"),
        location: "Nairobi Garage",
        categories: ["Networking & Professional"],
        createdBy: users[3]._id,
        image: "/images/atlasslan-community.jpg",
      },
      {
        title: "Hiring for Startups",
        description: "Hiring the right people early.",
        date: new Date("2025-12-08T21:00:00"),
        location: "Online",
        categories: ["Business & Entrepreneurship"],
        createdBy: users[4]._id,
        image: "/images/hiring-startups.jpg",
      },
    ];

    await Event.insertMany(dummyEvents);
    console.log(` Seeded ${dummyEvents.length} events.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
