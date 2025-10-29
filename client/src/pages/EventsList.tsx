import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Event[];
  error?: string;
}

function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/events");
        const data: ApiResponse = await response.json();

        if (data.success) {
          setEvents(data.data);
        } else {
          setError(data.error || "Failed to fetch events");
        }
      } catch (err) {
        setError("Unable to connect to backend server");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
      <h2>Upcoming Events ({events.length})</h2>

      {events.length === 0 ? (
        <p>
          No events found. <Link to="/create">Create one!</Link>
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {events.map((event, index) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  border: "1px solid #ddd",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  textAlign: "left",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",

                  // fadind in part
                  opacity: 0,
                  animation: `fadeIn 0.5s ease-out forwards`,
                  animationDelay: `${index * 0.2}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{event.title}</h3>
                {event.description && (
                  <p style={{ margin: "0.5rem 0", color: "#666" }}>
                    {event.description.substring(0, 100)}
                    {event.description.length > 100 ? "..." : ""}
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "1rem",
                    fontSize: "0.9rem",
                    color: "#888",
                  }}
                >
                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  {event.location && <span>📍 {event.location}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsList;
