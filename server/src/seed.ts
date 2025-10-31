import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/User";
import { Event } from "./models/Event";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/linkup";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create demo users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        interests: [
          "Tech & Development",
          "Business & Entrepreneurship",
          "Networking & Professional",
        ],
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        interests: ["Design & Creative", "Arts & Culture", "Social & Meetups"],
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: hashedPassword,
        interests: ["Sports & Fitness", "Health & Wellness", "Food & Dining"],
      },
    ]);

    console.log(`✅ Created ${users.length} demo users`);

    // Create demo events with categories
    const dummyEvents = [
      {
        title: "Tech Meetup Nairobi",
        description:
          "Join us for an evening of networking and learning about the latest in web development. Free pizza and drinks!",
        date: new Date("2025-11-15T18:00:00"),
        location: "iHub, Nairobi",
        categories: ["Tech & Development", "Networking & Professional"],
        createdBy: users[0]._id,
      },
      {
        title: "Startup Pitch Night",
        description:
          "Watch local startups pitch their ideas to investors. Open to everyone interested in the startup ecosystem.",
        date: new Date("2025-11-20T19:00:00"),
        location: "Nairobi Garage",
        categories: [
          "Business & Entrepreneurship",
          "Networking & Professional",
        ],
        createdBy: users[0]._id,
      },
      {
        title: "Coffee & Code",
        description:
          "Casual morning meetup for developers. Bring your laptop and work on projects together.",
        date: new Date("2025-11-10T09:00:00"),
        location: "Java House, Westlands",
        categories: ["Tech & Development", "Social & Meetups"],
        createdBy: users[1]._id,
      },
      {
        title: "Design Thinking Workshop",
        description:
          "Learn design thinking methodologies and apply them to real-world problems. Interactive and hands-on!",
        date: new Date("2025-12-01T14:00:00"),
        location: "BRCK HQ",
        categories: ["Design & Creative", "Education & Learning"],
        createdBy: users[1]._id,
      },
      {
        title: "Weekend Yoga Session",
        description:
          "Start your weekend right with a relaxing yoga session in the park. All levels welcome!",
        date: new Date("2025-11-16T07:00:00"),
        location: "Karura Forest",
        categories: ["Sports & Fitness", "Health & Wellness"],
        createdBy: users[2]._id,
      },
      {
        title: "Food Lovers Meetup",
        description:
          "Exploring Nairobi's best hidden food gems. Join fellow food enthusiasts for a culinary adventure!",
        date: new Date("2025-11-22T12:00:00"),
        location: "Various locations",
        categories: ["Food & Dining", "Social & Meetups"],
        createdBy: users[2]._id,
      },
      {
        title: "AI/ML Deep Dive",
        description:
          "Advanced workshop on machine learning algorithms and their practical applications. Bring your laptop!",
        date: new Date("2025-11-18T15:00:00"),
        location: "Moringa School",
        categories: ["Tech & Development", "Education & Learning"],
        createdBy: users[0]._id,
      },
      {
        title: "Art Gallery Opening",
        description:
          "Celebrate local artists at our new gallery opening. Wine and cheese provided.",
        date: new Date("2025-11-25T18:30:00"),
        location: "Nairobi National Museum",
        categories: ["Arts & Culture", "Social & Meetups"],
        createdBy: users[1]._id,
      },
      {
        title: "Gaming Tournament",
        description:
          "Competitive FIFA and Call of Duty tournament with prizes. Sign up now!",
        date: new Date("2025-11-17T14:00:00"),
        location: "iHub Gaming Lounge",
        categories: ["Gaming & Esports", "Social & Meetups"],
        createdBy: users[2]._id,
      },
      {
        title: "Live Jazz Night",
        description:
          "Enjoy an evening of smooth jazz with local musicians. Dinner reservations available.",
        date: new Date("2025-11-23T19:00:00"),
        location: "The Alchemist",
        categories: ["Music & Entertainment", "Social & Meetups"],
        createdBy: users[1]._id,
      },
    ];

    await Event.insertMany(dummyEvents);
    console.log(`✅ Seeded ${dummyEvents.length} events with categories`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n👤 Demo Users:");
    console.log("   Email: john@example.com | Password: password123");
    console.log(
      "   Interests: Tech & Development, Business & Entrepreneurship, Networking & Professional"
    );
    console.log("\n   Email: jane@example.com | Password: password123");
    console.log(
      "   Interests: Design & Creative, Arts & Culture, Social & Meetups"
    );
    console.log("\n   Email: mike@example.com | Password: password123");
    console.log(
      "   Interests: Sports & Fitness, Health & Wellness, Food & Dining"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
