import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Calendar, MapPin, Edit, Trash2 } from "lucide-react";
import linkEmoji from "../assets/link-emoji.png";

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  categories?: string[];
  image?: string;
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
}

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/events/${id}`,
        );

        if (response.data.success) {
          setEvent(response.data.data);
        } else {
          setError(response.data.error || "Event not found");
        }
      } catch (err) {
        setError("Unable to fetch event details");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/events/${id}`,
      );

      if (response.data.success) {
        navigate("/my-events");
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
        style={{
          background: "#D9D9D9",
          minHeight: "100vh",
          padding: "2rem",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", system-ui, sans-serif',
        }}
      >
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div
        style={{
          background: "#D9D9D9",
          minHeight: "100vh",
          padding: "3rem",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              padding: "1.5rem",
              background: "#f8d7da",
              borderRadius: "12px",
              marginBottom: "2rem",
              color: "#721c24",
            }}
          >
            <strong>❌ Error:</strong> {error || "Event not found"}
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "2px solid #394A93",
              background: "white",
              color: "#394A93",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && event.createdBy._id === user.id;

  return (
    <div
      style={{
        background: "#D9D9D9",
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", system-ui, sans-serif',
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
      <div style={{ padding: "3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "2rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            border: "2px solid #394A93",
            background: "white",
            color: "#394A93",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#394A93";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = "#394A93";
          }}
        >
          ← Back
        </button>

        <div
          style={{
            background: "#EFEFEF",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {/* Event Image */}
          {event.image && (
            <div
              style={{
                width: "100%",
                height: "400px",
                overflow: "hidden",
              }}
            >
              <img
                src={event.image}
                alt={event.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          {/* Event Content */}
          <div style={{ padding: "3rem" }}>
            {/* Header with Title and Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "2rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "3rem",
                    fontWeight: "700",
                    color: "#000",
                    lineHeight: "1.2",
                  }}
                >
                  {event.title}
                </h1>
              </div>
              {isOwner && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginLeft: "2rem",
                  }}
                >
                  <button
                    onClick={() => navigate(`/events/${event._id}/edit`)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      border: "none",
                      background: "#394A93",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#2d3a75")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#394A93")
                    }
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      border: "none",
                      background: "#dc3545",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#c82333")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#dc3545")
                    }
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Categories */}
            {event.categories && event.categories.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginBottom: "2rem",
                }}
              >
                {event.categories.map((category) => (
                  <span
                    key={category}
                    style={{
                      background: "#F0F2FF",
                      color: "#394A93",
                      padding: "0.5rem 1.25rem",
                      borderRadius: "20px",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Date and Location */}
            <div
              style={{
                display: "flex",
                gap: "3rem",
                marginBottom: "2.5rem",
                paddingBottom: "2rem",
                borderBottom: "2px solid #D0D0D0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "1.2rem",
                  color: "#333",
                }}
              >
                <Calendar size={24} strokeWidth={2} />
                <span style={{ fontWeight: "500" }}>
                  {new Date(event.date).toLocaleString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {event.location && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "1.2rem",
                    color: "#333",
                  }}
                >
                  <MapPin size={24} strokeWidth={2} />
                  <span style={{ fontWeight: "500" }}>{event.location}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div style={{ marginBottom: "3rem" }}>
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    marginBottom: "1.5rem",
                    color: "#000",
                  }}
                >
                  About this event
                </h2>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "#333",
                  }}
                >
                  {event.description}
                </p>
              </div>
            )}

            {/* Creator Info */}
            <div
              style={{
                borderTop: "2px solid #D0D0D0",
                paddingTop: "2rem",
              }}
            >
              <h3
                style={{
                  marginBottom: "1.5rem",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#000",
                }}
              >
                Event Organizer
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  background: "white",
                  borderRadius: "12px",
                }}
              >
                {event.createdBy.profilePicture ? (
                  <img
                    src={event.createdBy.profilePicture}
                    alt={event.createdBy.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #6C7DC6",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "#6C7DC6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "white",
                    }}
                  >
                    {event.createdBy.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "1.4rem",
                      color: "#000",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {event.createdBy.name}
                  </div>
                  <div
                    style={{
                      color: "#666",
                      fontSize: "1.1rem",
                    }}
                  >
                    {event.createdBy.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Created Date */}
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #D0D0D0",
                fontSize: "1rem",
                color: "#999",
              }}
            >
              Event created:{" "}
              {new Date(event.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
