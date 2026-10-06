import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description?: string;
    date: string;
    location?: string;
    categories?: string[];
    createdBy: {
      _id: string;
      name: string;
      profilePicture?: string;
    };
    matchScore?: number;
    image?: string;
  };
  showMatchScore?: boolean;
}

function EventCard({ event, showMatchScore = false }: EventCardProps) {
  return (
    <Link
      to={`/events/${event._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "1.5rem",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          cursor: "pointer",
          background: "white",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
          e.currentTarget.style.borderColor = "#646cff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "#ddd";
        }}
      >
        {/* Match Score Badge */}
        {showMatchScore &&
          event.matchScore !== undefined &&
          event.matchScore > 0 && (
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "#646cff",
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: "bold",
                zIndex: 2,
              }}
            >
              {Math.round(event.matchScore)}% Match
            </div>
          )}

        {/* Event Image */}
        {event.image && (
          <div style={{ margin: "-1.5rem -1.5rem 1rem -1.5rem", height: "180px", overflow: "hidden" }}>
            <img 
              src={event.image} 
              alt={event.title} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          </div>
        )}

        {/* Event Title */}
        <h3
          style={{
            margin: "0 0 0.75rem 0",
            fontSize: "1.25rem",
            lineHeight: "1.4",
          }}
        >
          {event.title}
        </h3>

        {/* Event Description */}
        {event.description && (
          <p
            style={{
              margin: "0 0 1rem 0",
              color: "#666",
              fontSize: "0.9rem",
              lineHeight: "1.5",
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </p>
        )}

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
                  background: "#f0f0ff",
                  color: "#646cff",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                }}
              >
                {category}
              </span>
            ))}
            {event.categories.length > 2 && (
              <span
                style={{
                  background: "#f5f5f5",
                  color: "#888",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                }}
              >
                +{event.categories.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Event Info */}
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              fontSize: "0.85rem",
              color: "#888",
              marginBottom: "0.75rem",
            }}
          >
            <span>
              <Calendar size={20} /> {new Date(event.date).toLocaleDateString()}
            </span>
            {event.location && (
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <MapPin size={20} /> {event.location}
              </span>
            )}
          </div>

          {/* Creator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            {event.createdBy.profilePicture ? (
              <img
                src={event.createdBy.profilePicture}
                alt={event.createdBy.name}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  color: "#999",
                }}
              >
                {event.createdBy.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: "0.85rem", color: "#666" }}>
              {event.createdBy.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
