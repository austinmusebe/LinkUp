import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Calendar, MapPin, Edit, Trash2, Plus } from "lucide-react";
import axios from "axios";
import linkEmoji from "../assets/link-emoji.png";

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  categories?: string[];
  eventImage?: string;
  createdAt: string;
}

function MyEvents() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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

  const handleDelete = async (eventId: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) return;

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
    return (
      <div
        style={{ background: "#D9D9D9", minHeight: "100vh", padding: "2rem" }}
      >
        <p>Loading your events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ background: "#D9D9D9", minHeight: "100vh", padding: "2rem" }}
      >
        <div
          style={{
            padding: "1rem",
            background: "#f8d7da",
            borderRadius: "8px",
          }}
        >
          <strong>❌ Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#D9D9D9",
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        fontFamily: '"SF Pro", serif',
      }}
    >
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
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src={linkEmoji}
            alt="Link"
            style={{ width: "30px", height: "30px" }}
          />
          LinkUp
        </div>

        <input
          type="text"
          placeholder="Find Events"
          style={{
            width: "500px",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "none",
            background: "#C4C4C4",
            fontSize: "1rem",
            textAlign: "center",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <div
            onClick={() => navigate("/events")}
            style={{
              color: "white",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
          >
            View Events
          </div>
          <div
            onClick={() => navigate("/create")}
            style={{
              color: "white",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
          >
            Create Event
          </div>
          <div
            onClick={() => navigate("/my-events")}
            style={{
              color: "white",
              cursor: "pointer",
              fontSize: "1.1rem",
              textDecoration: "underline",
            }}
          >
            My Events
          </div>
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
      <div style={{ padding: "3rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              color: "#000000",
              margin: 0,
            }}
          >
            My Events
          </h1>
          <button
            onClick={() => navigate("/create")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              borderRadius: "8px",
              border: "none",
              background: "#6C7DC6",
              color: "white",
              fontSize: "1.1rem",
              cursor: "pointer",
              fontWeight: "600",
              transition: "background 0.3s",
              fontFamily: '"SF Pro", serif',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#5a6bb0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#6C7DC6")}
          >
            <Plus size={20} />
            Create New Event
          </button>
        </div>

        {events.length === 0 ? (
          <div
            style={{
              background: "#E8E8E8",
              borderRadius: "12px",
              padding: "4rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                marginBottom: "1.5rem",
                opacity: 0.5,
              }}
            >
              <img src={linkEmoji} />
            </div>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#333",
              }}
            >
              No Events Yet
            </h2>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#666",
                marginBottom: "2rem",
                fontFamily: "SF Pro Display",
              }}
            >
              You haven't created any events yet. Start connecting with your
              community!
            </p>
            <button
              onClick={() => navigate("/create")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem 2.5rem",
                borderRadius: "8px",
                border: "none",
                background: "#6C7DC6",
                color: "white",
                fontSize: "1.2rem",
                cursor: "pointer",
                fontWeight: "600",
                fontFamily: '"SF Pro", serif',
              }}
            >
              <Plus size={22} />
              Create Your First Event
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
            }}
          >
            {events.map((event) => (
              <div
                key={event._id}
                style={{
                  background: "#E8E8E8",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                {/* Event Image */}
                <div
                  onClick={() => navigate(`/events/${event._id}`)}
                  style={{
                    width: "100%",
                    height: "180px",
                    background: event.eventImage ? "transparent" : "#C4C4C4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  {event.eventImage ? (
                    <img
                      src={event.eventImage}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src="data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Ccircle cx='50' cy='30' r='20' fill='%23999'/%3E%3Ccircle cx='30' cy='65' r='15' fill='%23999'/%3E%3Crect x='55' y='55' width='25' height='25' rx='5' fill='%23999'/%3E%3C/g%3E%3C/svg%3E"
                      alt="placeholder"
                      style={{ opacity: 0.5 }}
                    />
                  )}
                </div>

                {/* Card Content */}
                <div style={{ padding: "1.25rem" }}>
                  <h3
                    onClick={() => navigate(`/events/${event._id}`)}
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "600",
                      margin: "0 0 1rem 0",
                      color: "#000",
                      cursor: "pointer",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#6C7DC6")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#000")}
                  >
                    {event.title}
                  </h3>

                  {/* Categories */}
                  {event.categories && event.categories.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginBottom: "1rem",
                      }}
                    >
                      {event.categories.slice(0, 2).map((category) => (
                        <span
                          key={category}
                          style={{
                            background: "#F0F2FF",
                            color: "#394A93",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                            fontWeight: "500",
                          }}
                        >
                          {category}
                        </span>
                      ))}
                      {event.categories.length > 2 && (
                        <span
                          style={{
                            background: "#F5F5F5",
                            color: "#888",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "12px",
                            fontSize: "0.85rem",
                          }}
                        >
                          +{event.categories.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Date and Location */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#555",
                        fontSize: "1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <Calendar size={16} />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {event.location && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "#555",
                          fontSize: "1rem",
                        }}
                      >
                        <MapPin size={16} />
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {event.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description Preview */}
                  {event.description && (
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "#666",
                        lineHeight: "1.5",
                        marginBottom: "1.25rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {event.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid #D0D0D0",
                    }}
                  >
                    <button
                      onClick={() => navigate(`/events/${event._id}`)}
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "2px solid #999",
                        background: "white",
                        color: "#333",
                        fontSize: "1rem",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontFamily: '"SF Pro", serif',
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f5f5f5";
                        e.currentTarget.style.borderColor = "#666";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.borderColor = "#999";
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/events/${event._id}/edit`)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "none",
                        background: "#394A93",
                        color: "white",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#2d3a75")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#394A93")
                      }
                      title="Edit Event"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id, event.title)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "none",
                        background: "#dc3545",
                        color: "white",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#c82333")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#dc3545")
                      }
                      title="Delete Event"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

export default MyEvents;
