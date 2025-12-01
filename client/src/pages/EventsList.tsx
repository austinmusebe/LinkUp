import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import linkEmoji from "../assets/link-emoji.png";

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  categories?: string[];
  eventImage?: string; // Add this line
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [selectedDateFilter, setSelectedDateFilter] =
    useState<string>("All Time");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const dateFilters = [
    "All Time",
    "This Week",
    "This Month",
    "Next 3 Months",
    "Next Year",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get(
          "http://localhost:3000/api/categories",
        );
        if (categoriesResponse.data.success) {
          setCategories(categoriesResponse.data.data);
        }

        // Fetch all events
        const eventsResponse = await axios.get(
          "http://localhost:3000/api/events",
        );
        if (eventsResponse.data.success) {
          setAllEvents(eventsResponse.data.data);
          setFilteredEvents(eventsResponse.data.data);
        }

        // Fetch recommended events if user is logged in
        if (user) {
          try {
            const recommendedResponse = await axios.get(
              "http://localhost:3000/api/events/recommended",
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
    let filtered = [...allEvents];

    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (event) =>
          event.categories && event.categories.includes(selectedCategory),
      );
    }

    // Filter by date
    const now = new Date();
    const filterByDate = (event: Event) => {
      const eventDate = new Date(event.date);
      const diffTime = eventDate.getTime() - now.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      switch (selectedDateFilter) {
        case "All Time":
          return true;
        case "This Week":
          return diffDays >= 0 && diffDays <= 7;
        case "This Month":
          return diffDays >= 0 && diffDays <= 30;
        case "Next 3 Months":
          return diffDays >= 0 && diffDays <= 90;
        case "Next Year":
          return diffDays >= 0 && diffDays <= 365;
        default:
          return true;
      }
    };

    filtered = filtered.filter(filterByDate);
    setFilteredEvents(filtered);
  }, [selectedCategory, selectedDateFilter, allEvents]);

  if (loading) {
    return (
      <div
        style={{ background: "#D9D9D9", minHeight: "100vh", padding: "2rem" }}
      >
        <p>Loading events...</p>
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
        background: "#F0F2F9",
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
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
          }}
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
            to="/my-events"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "1.1rem",
            }}
          >
            My Events
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
      <div style={{ padding: "2rem 3rem" }}>
        {/* Active Events Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#000000",
              margin: 0,
            }}
          >
            Active Events
          </h2>

          <div style={{ display: "flex", gap: "1rem" }}>
            {/* Category Dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowDateDropdown(false);
                }}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "25px",
                  border: "none",
                  background: "#394A93",
                  color: "white",
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "500",
                }}
              >
                {selectedCategory} ▼
              </button>
              {showCategoryDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "0.5rem",
                    background: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    minWidth: "200px",
                    zIndex: 100,
                    color: "grey",
                  }}
                >
                  <div
                    onClick={() => {
                      setSelectedCategory("All Categories");
                      setShowCategoryDropdown(false);
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      color: "grey",
                    }}
                  >
                    All Categories
                  </div>
                  {categories.map((category) => (
                    <div
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowCategoryDropdown(false);
                      }}
                      style={{
                        padding: "0.75rem 1rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Filter Dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setShowDateDropdown(!showDateDropdown);
                  setShowCategoryDropdown(false);
                }}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "25px",
                  border: "none",
                  background: "#394A93",
                  color: "white",
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "500",
                }}
              >
                {selectedDateFilter} ▼
              </button>
              {showDateDropdown && (
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
                    color: "grey",
                  }}
                >
                  {dateFilters.map((filter) => (
                    <div
                      key={filter}
                      onClick={() => {
                        setSelectedDateFilter(filter);
                        setShowDateDropdown(false);
                      }}
                      style={{
                        padding: "0.75rem 1rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {filter}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
            marginBottom: "4rem",
          }}
        >
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              style={{
                background: "#E8E8E8",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#6C7DC6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "1.2rem",
                    }}
                  >
                    {event.createdBy.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                      {event.createdBy.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Area */}
              {/* Event Image */}
              <div
                style={{
                  width: "100%",
                  height: "150px",
                  background: event.eventImage ? "transparent" : "#C4C4C4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
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
              <div style={{ padding: "1rem" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    margin: "0 0 0.5rem 0",
                    color: "#000",
                  }}
                >
                  {event.title}
                </h3>

                {event.categories && event.categories.length > 0 && (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {event.categories.join(", ")}
                  </div>
                )}

                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "0.75rem",
                  }}
                >
                  {new Date(event.date).toLocaleDateString()}
                </div>

                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    lineHeight: "1.4",
                    marginBottom: "1rem",
                    minHeight: "3rem",
                  }}
                >
                  {event.description
                    ? event.description.length > 100
                      ? event.description.substring(0, 100) + "..."
                      : event.description
                    : "There is no event description."}
                </p>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => navigate(`/events/${event._id}`)}
                    style={{
                      padding: "0.5rem 1.25rem",
                      borderRadius: "20px",
                      border: "1px solid #999",
                      background: "white",
                      color: "#333",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    View More
                  </button>
                  <button
                    onClick={() => navigate(`/events/${event._id}`)}
                    style={{
                      padding: "0.5rem 1.25rem",
                      borderRadius: "20px",
                      border: "none",
                      background: "#6C7DC6",
                      color: "white",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Section */}
        {user && recommendedEvents.length > 0 && (
          <>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#000000",
                margin: "3rem 0 2rem 0",
              }}
            >
              Recommended for You
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1.5rem",
              }}
            >
              {recommendedEvents.map((event) => (
                <div
                  key={event._id}
                  style={{
                    background: "#E8E8E8",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Same card structure as above */}
                  <div
                    style={{
                      padding: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "#6C7DC6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "1.2rem",
                        }}
                      >
                        {event.createdBy.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                          {event.createdBy.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      background: "#C4C4C4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Ccircle cx='50' cy='30' r='20' fill='%23999'/%3E%3Ccircle cx='30' cy='65' r='15' fill='%23999'/%3E%3Crect x='55' y='55' width='25' height='25' rx='5' fill='%23999'/%3E%3C/g%3E%3C/svg%3E"
                      alt="placeholder"
                      style={{ opacity: 0.5 }}
                    />
                  </div>

                  <div style={{ padding: "1rem" }}>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        margin: "0 0 0.5rem 0",
                        color: "#000",
                      }}
                    >
                      {event.title}
                    </h3>

                    {event.categories && event.categories.length > 0 && (
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#666",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {event.categories.join(", ")}
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {new Date(event.date).toLocaleDateString()}
                    </div>

                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        lineHeight: "1.4",
                        marginBottom: "1rem",
                        minHeight: "3rem",
                      }}
                    >
                      {event.description
                        ? event.description.length > 100
                          ? event.description.substring(0, 100) + "..."
                          : event.description
                        : "There is no event description."}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() => navigate(`/events/${event._id}`)}
                        style={{
                          padding: "0.5rem 1.25rem",
                          borderRadius: "20px",
                          border: "1px solid #999",
                          background: "white",
                          color: "#333",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          fontWeight: "500",
                        }}
                      >
                        View More
                      </button>
                      <button
                        onClick={() => navigate(`/events/${event._id}`)}
                        style={{
                          padding: "0.5rem 1.25rem",
                          borderRadius: "20px",
                          border: "none",
                          background: "#6C7DC6",
                          color: "white",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          fontWeight: "500",
                        }}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EventsList;
