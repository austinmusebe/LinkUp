import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
// Make sure to import your image here

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  createdAt: string;
}

function MyEvents() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Header State
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Existing Component State
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/events/user/${user.id}`,
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
        `http://localhost:3000/api/events/${eventId}`,
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
    <div style={{ background: "white", minHeight: "100vh" }}>
      {/* Header */}
      <header
        style={{
          background: "#000000",
          padding: "1rem 3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "600",
          }}
        >
          LinkUp
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <Link
            to="/create"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "1.1rem",
            }}
          >
            Create Event
          </Link>
          <Link
            to="/events"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "1.1rem",
            }}
          >
            View Events
          </Link>
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#C4C4C4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#666">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>

            {showProfileDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "0.5rem",
                  background: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  minWidth: "180px",
                  zIndex: 100,
                }}
              >
                <div
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileDropdown(false);
                  }}
                  style={{
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    color: "#333",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  Manage Account
                </div>
                <div
                  onClick={() => {
                    logout();
                    setShowProfileDropdown(false);
                    navigate("/");
                  }}
                  style={{
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    color: "#333",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: "2rem" }}>
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
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
                      <span>
                        📅 {new Date(event.date).toLocaleDateString()}
                      </span>
                      {event.location && <span>📍 {event.location}</span>}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginLeft: "1rem",
                    }}
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
    </div>
  );
}

export default MyEvents;
