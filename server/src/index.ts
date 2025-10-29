import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import mongoose from "mongoose";

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/linkup";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Mongoose Schema & Model
const linkUpEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  location: String,
  createdAt: { type: Date, default: Date.now },
});

const LinkUpEvent = mongoose.model("LinkUpEvent", linkUpEventSchema);

// Elysia Server with CORS
const app = new Elysia()
  .use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ],
      credentials: true,
    })
  )
  .get("/", () => ({ message: "LinkUp API - Server Running" }))
  .get("/api/events", async () => {
    try {
      const events = await LinkUpEvent.find().sort({ date: -1 });
      return {
        success: true,
        count: events.length,
        data: events,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch events",
      };
    }
  })
  .get("/api/events/:id", async ({ params }) => {
    try {
      const event = await LinkUpEvent.findById(params.id);
      if (!event) {
        return {
          success: false,
          error: "Event not found",
        };
      }
      return {
        success: true,
        data: event,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch event",
      };
    }
  })
  .post("/api/events", async ({ body }) => {
    try {
      const event = new LinkUpEvent(body);
      await event.save();
      return {
        success: true,
        data: event,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to create event",
      };
    }
  })
  .listen(3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
