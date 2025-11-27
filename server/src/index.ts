import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User, INTEREST_CATEGORIES } from "./models/User";
import { Event } from "./models/Event";
import { generateToken, authMiddleware } from "./middleware/auth";

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/linkup";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Recommendation Algorithm
function calculateMatchScore(
  userInterests: string[],
  eventCategories: string[],
): number {
  if (!eventCategories || eventCategories.length === 0) return 0;
  if (!userInterests || userInterests.length === 0) return 0;

  // Count matching categories
  const matches = eventCategories.filter((cat) =>
    userInterests.includes(cat),
  ).length;

  // Calculate percentage match
  const matchScore = (matches / eventCategories.length) * 100;

  return matchScore;
}

// Elysia Server
const app = new Elysia()
  .use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ],
      credentials: true,
    }),
  )
  .use(
    staticPlugin({
      assets: "uploads",
      prefix: "/uploads",
    }),
  )

  // Health check
  .get("/", () => ({ message: "LinkUp API - Server Running" }))

  // ===== AUTH ROUTES =====
  .post("/api/auth/signup", async ({ body }: any) => {
    try {
      const { name, email, password } = body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return { success: false, error: "Email already registered" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        interests: [],
      });
      await user.save();

      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
      });

      return {
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            interests: user.interests,
          },
        },
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "Failed to create account" };
    }
  })

  .post("/api/auth/login", async ({ body }: any) => {
    try {
      const { email, password } = body;

      const user = await User.findOne({ email });
      if (!user) {
        return { success: false, error: "Invalid email or password" };
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return { success: false, error: "Invalid email or password" };
      }

      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
      });

      return {
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            interests: user.interests,
          },
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed" };
    }
  })

  .get("/api/auth/me", async ({ headers }) => {
    const auth = authMiddleware(headers.authorization);
    if (!auth.success) {
      return auth;
    }

    try {
      const user = await User.findById(auth.userId).select("-password");
      if (!user) {
        return { success: false, error: "User not found" };
      }

      return {
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          interests: user.interests,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      return { success: false, error: "Failed to fetch user" };
    }
  })

  // ===== USER PROFILE ROUTES =====
  .put("/api/users/profile", async ({ headers, body }: any) => {
    const auth = authMiddleware(headers.authorization);
    if (!auth.success) {
      return auth;
    }

    try {
      const { name, interests } = body;
      const user = await User.findById(auth.userId);

      if (!user) {
        return { success: false, error: "User not found" };
      }

      if (name) user.name = name;
      if (interests) user.interests = interests;

      await user.save();

      return {
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          interests: user.interests,
        },
      };
    } catch (error) {
      return { success: false, error: "Failed to update profile" };
    }
  })

  .post("/api/users/profile-picture", async ({ headers, body }: any) => {
    const auth = authMiddleware(headers.authorization);
    if (!auth.success) {
      return auth;
    }

    try {
      const { image } = body;

      if (!image) {
        return { success: false, error: "No image provided" };
      }

      const user = await User.findById(auth.userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      user.profilePicture = image;
      await user.save();

      return {
        success: true,
        data: { profilePicture: user.profilePicture },
      };
    } catch (error) {
      return { success: false, error: "Failed to upload profile picture" };
    }
  })

  .get("/api/categories", () => {
    return {
      success: true,
      data: INTEREST_CATEGORIES,
    };
  })

  // ===== EVENT ROUTES =====
  .get("/api/events", async () => {
    try {
      const events = await Event.find()
        .populate("createdBy", "name email profilePicture")
        .sort({ date: -1 });

      return {
        success: true,
        count: events.length,
        data: events,
      };
    } catch (error) {
      return { success: false, error: "Failed to fetch events" };
    }
  })

  // NEW: Recommended events endpoint
  .get("/api/events/recommended", async ({ headers }) => {
    const auth = authMiddleware(headers.authorization);
    if (!auth.success) {
      return auth;
    }

    try {
      const user = await User.findById(auth.userId);
      if (!user || !user.interests || user.interests.length === 0) {
        return {
          success: true,
          data: [],
          message:
            "Set your interests in your profile to get personalized recommendations",
        };
      }

      // Get all upcoming events
      const allEvents = await Event.find({ date: { $gte: new Date() } })
        .populate("createdBy", "name email profilePicture")
        .lean();

      // Calculate match scores
      const eventsWithScores = allEvents.map((event) => ({
        ...event,
        matchScore: calculateMatchScore(user.interests, event.categories || []),
      }));

      // Filter events with at least one matching category and sort by score
      const recommendedEvents = eventsWithScores
        .filter((event) => event.matchScore > 0)
        .sort((a, b) => {
          // Sort by match score first, then by date
          if (b.matchScore !== a.matchScore) {
            return b.matchScore - a.matchScore;
          }
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

      return {
        success: true,
        count: recommendedEvents.length,
        data: recommendedEvents,
      };
    } catch (error) {
      console.error("Recommendation error:", error);
      return { success: false, error: "Failed to fetch recommendations" };
    }
  })

  .get("/api/events/:id", async ({ params }) => {
    try {
      const event = await Event.findById(params.id).populate(
        "createdBy",
        "name email profilePicture",
      );

      if (!event) {
        return { success: false, error: "Event not found" };
      }

      return { success: true, data: event };
    } catch (error) {
      return { success: false, error: "Failed to fetch event" };
    }
  })

  .get("/api/events/user/:userId", async ({ params }) => {
    try {
      const events = await Event.find({ createdBy: params.userId })
        .populate("createdBy", "name email profilePicture")
        .sort({ date: -1 });

      return {
        success: true,
        count: events.length,
        data: events,
      };
    } catch (error) {
      return { success: false, error: "Failed to fetch user events" };
    }
  })

  .post("/api/events", async ({ headers, body }: any) => {
    const auth = authMiddleware(headers.authorization);
    if (!auth.success) {
      return auth;
    }

    try {
      const event = new Event({
        ...body,
        createdBy: auth.userId,
      });
      await event.save();

      const populatedEvent = await Event.findById(event._id).populate(
        "createdBy",
        "name email profilePicture",
      );

      return { success: true, data: populatedEvent };
    } catch (error) {
      return { success: false, error: "Failed to create event" };
    }
  })

  .put("/api/events/:id", async ({ headers, params, body }: any) => {
    const auth = authMiddleware(headers.authorization);
    if (!auth.success) {
      return auth;
    }

    try {
      const event = await Event.findById(params.id);

      if (!event) {
        return { success: false, error: "Event not found" };
      }

      if (event.createdBy.toString() !== auth.userId) {
        return { success: false, error: "Not authorized to edit this event" };
      }

      Object.assign(event, body);
      await event.save();

      const updatedEvent = await Event.findById(event._id).populate(
        "createdBy",
        "name email profilePicture",
      );

      return { success: true, data: updatedEvent };
    } catch (error) {
      return { success: false, error: "Failed to update event" };
    }
  })

  .delete("/api/events/:id", async ({ headers, params }) => {
    const auth = authMiddleware(headers.authorization);
    if (!auth.success) {
      return auth;
    }

    try {
      const event = await Event.findById(params.id);

      if (!event) {
        return { success: false, error: "Event not found" };
      }

      if (event.createdBy.toString() !== auth.userId) {
        return { success: false, error: "Not authorized to delete this event" };
      }

      await Event.findByIdAndDelete(params.id);

      return { success: true, message: "Event deleted" };
    } catch (error) {
      return { success: false, error: "Failed to delete event" };
    }
  })

  .post("/api/events/:id/image", async ({ headers, params, body }: any) => {
    const auth = authMiddleware(headers.authorization);
    if (!auth.success) {
      return auth;
    }

    try {
      const { image } = body;

      if (!image) {
        return { success: false, error: "No image provided" };
      }

      const event = await Event.findById(params.id);

      if (!event) {
        return { success: false, error: "Event not found" };
      }

      // Check ownership
      if (event.createdBy.toString() !== auth.userId) {
        return { success: false, error: "Not authorized to update this event" };
      }

      event.eventImage = image;
      await event.save();

      const updatedEvent = await Event.findById(event._id).populate(
        "createdBy",
        "name email profilePicture",
      );

      return { success: true, data: updatedEvent };
    } catch (error) {
      return { success: false, error: "Failed to upload event image" };
    }
  })

  .listen(3000);

console.log(`Server running at http://localhost:${app.server?.port}`);
