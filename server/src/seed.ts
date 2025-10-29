import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/linkup";

const linkUpEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  location: String,
  createdAt: { type: Date, default: Date.now },
});

const LinkUpEvent = mongoose.model("LinkUpEvent", linkUpEventSchema);

const dummyEvents = [
  {
    title: "Tech Meetup Nairobi",
    description:
      "Join us for an evening of networking and learning about the latest in web development. Free pizza and drinks!",
    date: new Date("2025-11-15T18:00:00"),
    location: "iHub, Nairobi",
  },
  {
    title: "Startup Pitch Night",
    description:
      "Watch local startups pitch their ideas to investors. Open to everyone interested in the startup ecosystem.",
    date: new Date("2025-11-20T19:00:00"),
    location: "Nairobi Garage",
  },
  {
    title: "Coffee & Code",
    description:
      "Casual morning meetup for developers. Bring your laptop and work on projects together.",
    date: new Date("2025-11-10T09:00:00"),
    location: "Java House, Westlands",
  },
  {
    title: "AI/ML Workshop",
    description:
      "Hands-on workshop covering machine learning basics with Python. Laptops required.",
    date: new Date("2025-12-01T14:00:00"),
    location: "Moringa School",
  },
  {
    title: "Design Thinking Session",
    description:
      "Learn design thinking methodologies and apply them to real-world problems.",
    date: new Date("2025-11-25T16:00:00"),
    location: "BRCK HQ",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing events
    await LinkUpEvent.deleteMany({});
    console.log("🗑️  Cleared existing events");

    // Insert dummy data
    await LinkUpEvent.insertMany(dummyEvents);
    console.log(`✅ Seeded ${dummyEvents.length} events`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
