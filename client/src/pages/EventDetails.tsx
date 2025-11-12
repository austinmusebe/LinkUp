import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Calendar, MapPin } from "lucide-react";

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
}

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/events/${id}`
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
        `http://localhost:3000/api/events/${id}`
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
    return <p>Loading event details...</p>;
  }

  if (error || !event) {
    return (
      <div>
        <div
          style={{
            padding: "1rem",
            background: "#f8d7da",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <strong>Error:</strong> {error || "Event not found"}
        </div>
        <Link to="/">← Back to Events</Link>
      </div>
    );
  }

  const isOwner = user && event.createdBy._id === user.id;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem", cursor: "pointer" }}
      >
        ← Back
      </button>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "2rem",
          borderRadius: "12px",
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
          <h2 style={{ marginTop: 0 }}>{event.title}</h2>
          {isOwner && (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link to={`/events/${event._id}/edit`}>
                <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
                  Edit
                </button>
              </Link>
              <button
                onClick={handleDelete}
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
          )}
        </div>

        {/* Categories */}
        {event.categories && event.categories.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "1.5rem",
            }}
          >
            {event.categories.map((category) => (
              <span
                key={category}
                style={{
                  background: "#f0f0ff",
                  color: "#646cff",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                {category}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginBottom: "1.5rem",
            fontSize: "1.1rem",
            color: "#666",
          }}
        >
          <span>
            <Calendar size={20} /> {new Date(event.date).toLocaleString()}
          </span>
          {event.location && (
            <span>
              <MapPin size={20} /> {event.location}
            </span>
          )}
        </div>

        {event.description && (
          <div style={{ lineHeight: "1.6", marginBottom: "2rem" }}>
            <h3>About this event</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{event.description}</p>
          </div>
        )}

        {/* Creator Info */}
        <div
          style={{
            borderTop: "1px solid #eee",
            paddingTop: "1.5rem",
            marginTop: "2rem",
          }}
        >
          <h4 style={{ marginBottom: "1rem" }}>Event Organizer</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {event.createdBy.profilePicture ? (
              <img
                src={event.createdBy.profilePicture}
                alt={event.createdBy.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  color: "#999",
                }}
              >
                {event.createdBy.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {event.createdBy.name}
              </div>
              <div style={{ color: "#888", fontSize: "0.9rem" }}>
                {event.createdBy.email}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1rem",
            borderTop: "1px solid #eee",
            fontSize: "0.9rem",
            color: "#999",
          }}
        >
          Created: {new Date(event.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
