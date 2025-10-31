import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  createdAt: string;
}

function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/events/user/${user.id}`
        );

        if (response.data.success) {
          setEvents(response.data.data);
        } else {
          setError(response.data.error || "Failed to fetch events");
        }
      } catch (err) {
        setError("Unable to fetch your events");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user]);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/events/${eventId}`
      );

      if (response.data.success) {
        setEvents(events.filter((e) => e._id !== eventId));
      } else {
        alert(response.data.error || "Failed to delete event");
      }
    } catch (err) {
      alert("Failed to delete event");
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return <p>Loading your events...</p>;
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2>My Events ({events.length})</h2>
        <Link to="/create">
          <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            + Create New Event
          </button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
          <p>You haven't created any events yet.</p>
          <Link to="/create">
            <button
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
              }}
            >
              Create Your First Event
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {events.map((event) => (
            <div
              key={event._id}
              style={{
                border: "1px solid #ddd",
                padding: "1.5rem",
                borderRadius: "8px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{event.title}</h3>
                  {event.description && (
                    <p style={{ margin: "0.5rem 0", color: "#666" }}>
                      {event.description.substring(0, 150)}
                      {event.description.length > 150 ? "..." : ""}
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
                <div
                  style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}
                >
                  <Link to={`/events/${event._id}`}>
                    <button
                      style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
                    >
                      View
                    </button>
                  </Link>
                  <Link to={`/events/${event._id}/edit`}>
                    <button
                      style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(event._id)}
                    style={{
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
