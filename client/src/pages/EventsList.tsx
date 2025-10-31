import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import EventCard from "../components/EventCard";

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  categories?: string[];
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  matchScore?: number;
}

function EventsList() {
  const { user } = useAuth();
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get(
          "http://localhost:3000/api/categories"
        );
        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data);
        }

        // Fetch all events
        const eventsResponse = await axios.get(
          "http://localhost:3000/api/events"
        );
        if (eventsResponse.data.success) {
          setAllEvents(eventsResponse.data.data);
          setFilteredEvents(eventsResponse.data.data);
        }

        // Fetch recommended events if user is logged in
        if (user) {
          try {
            const recommendedResponse = await axios.get(
              "http://localhost:3000/api/events/recommended"
            );
            if (recommendedResponse.data.success) {
              setRecommendedEvents(recommendedResponse.data.data);
            }
          } catch (err) {
            console.log("Could not fetch recommendations:", err);
          }
        }
      } catch (err) {
        setError("Unable to fetch events");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredEvents(allEvents);
    } else {
      setFilteredEvents(
        allEvents.filter(
          (event) =>
            event.categories && event.categories.includes(selectedCategory)
        )
      );
    }
  }, [selectedCategory, allEvents]);

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return (
      <div
        style={{ padding: "1rem", background: "#f8d7da", borderRadius: "8px" }}
      >
        <strong>❌ Error:</strong> {error}
      </div>
    );
  }

  return (
    <div>
      {/* Recommended Section */}
      {user && recommendedEvents.length > 0 && (
        <section style={{ marginBottom: "3rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 0.5rem 0" }}>Recommended for You</h2>
              <p style={{ margin: 0, color: "#cececeff", fontSize: "0.9rem" }}>
                Based on your interests: {user.interests.join(", ")}
              </p>
            </div>
            <Link
              to="/profile"
              style={{ fontSize: "0.9rem", color: "#646cff" }}
            >
              Update interests
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "5rem",
              paddingBottom: 20,
            }}
          >
            {recommendedEvents.slice(0, 6).map((event) => (
              <EventCard key={event._id} event={event} showMatchScore={true} />
            ))}
          </div>
        </section>
      )}

      {/* No Interests Message */}
      {user && user.interests.length === 0 && (
        <div
          style={{
            background: "#f0f0ff",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 0.5rem 0" }}>
            🎯 Get Personalized Recommendations
          </h3>
          <p style={{ margin: "0 0 1rem 0", color: "#666" }}>
            Set your interests to see events tailored just for you!
          </p>
          <Link to="/profile">
            <button style={{ padding: "0.75rem 1.5rem", cursor: "pointer" }}>
              Set Your Interests
            </button>
          </Link>
        </div>
      )}

      {/* All Events Section */}
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {selectedCategory === "All" ? "All Events" : selectedCategory}
            <span
              style={{
                color: "#888",
                fontWeight: "normal",
                marginLeft: "0.5rem",
              }}
            >
              ({filteredEvents.length})
            </span>
          </h2>
        </div>

        {/* Category Filter */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            overflowX: "auto",
            paddingBottom: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <button
            onClick={() => setSelectedCategory("All")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border:
                selectedCategory === "All"
                  ? "2px solid #646cff"
                  : "1px solid #ddd",
              background: selectedCategory === "All" ? "#f0f0ff" : "white",
              color: selectedCategory === "All" ? "#646cff" : "#666",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: selectedCategory === "All" ? "600" : "400",
              whiteSpace: "nowrap",
            }}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                border:
                  selectedCategory === category
                    ? "2px solid #646cff"
                    : "1px solid #ddd",
                background: selectedCategory === category ? "#f0f0ff" : "white",
                color: selectedCategory === category ? "#646cff" : "#666",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: selectedCategory === category ? "600" : "400",
                whiteSpace: "nowrap",
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#666",
              background: "#f5f5f5",
              borderRadius: "12px",
            }}
          >
            <p style={{ margin: "0 0 1rem 0" }}>
              No events found in this category.
            </p>
            {user && (
              <Link to="/create">
                <button
                  style={{ padding: "0.75rem 1.5rem", cursor: "pointer" }}
                >
                  Create the First Event
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "5rem",
            }}
          >
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EventsList;
