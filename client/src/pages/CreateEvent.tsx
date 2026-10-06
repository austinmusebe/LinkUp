import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { compressImage } from "../utils/imageCompression";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import linkEmoji from "../assets/link-emoji.png";

function CreateEvent() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    categories: [] as string[],
  });
  const [eventImage, setEventImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/categories`)
      .then((response) => {
        if (response.data.success) {
          setCategories(response.data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const webpBase64 = await compressImage(file);
      setEventImage(webpBase64);
      setImagePreview(webpBase64);
    } catch (err) {
      console.error("Failed to compress image", err);
    }
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/events`, {
        ...formData,
        date: new Date(formData.date),
        image: eventImage,
      });

      if (response.data.success) {
        navigate("/my-events");
      } else {
        setError(response.data.error || "Failed to create event");
      }
    } catch (err) {
      setError("Unable to create event");
      console.error("Create error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #E5E5E5 0%, #D0D8E8 100%)",
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
              textDecoration: "underline",
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
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  My Profile
                </div>
                <div
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  style={{
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    color: "#dc3545",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "3rem" }}>
        <h2
          style={{
            fontSize: "3rem",
            fontWeight: "600",
            marginBottom: "2rem",
            color: "#000",
          }}
        >
          Create New Event
        </h2>

        {error && (
          <div
            style={{
              padding: "1rem",
              background: "#f8d7da",
              borderRadius: "8px",
              marginBottom: "1rem",
              color: "#721c24",
            }}
          >
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Event Image Upload */}
          <div
            style={{
              background: "#EFEFEF",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "1rem",
                fontWeight: "600",
                fontSize: "1.2rem",
                color: "#333",
              }}
            >
              Event Image
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <div
                style={{
                  width: "200px",
                  height: "150px",
                  borderRadius: "8px",
                  background: imagePreview ? "transparent" : "#C4C4C4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "2px solid #6C7DC6",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ color: "#666", fontSize: "1rem" }}>
                    No image
                  </span>
                )}
              </div>

              <label
                style={{
                  padding: "0.75rem 2rem",
                  background: "#394A93",
                  color: "white",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  transition: "background 0.3s",
                }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#666",
                marginTop: "0.75rem",
              }}
            >
              Upload an image to make your event stand out (optional)
            </p>
          </div>

          {/* Event Title */}
          <div
            style={{
              background: "#EFEFEF",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "0.75rem",
                fontWeight: "600",
                fontSize: "1.2rem",
                color: "#333",
              }}
            >
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                fontSize: "1.1rem",
                border: "2px solid #C4C4C4",
                borderRadius: "8px",
                background: "white",
                fontFamily: '"SF Pro", serif',
              }}
            />
          </div>

          {/* Description */}
          <div
            style={{
              background: "#EFEFEF",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "0.75rem",
                fontWeight: "600",
                fontSize: "1.2rem",
                color: "#333",
              }}
            >
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                fontSize: "1.1rem",
                border: "2px solid #C4C4C4",
                borderRadius: "8px",
                background: "white",
                fontFamily: '"SF Pro", serif',
                resize: "vertical",
              }}
            />
          </div>

          {/* Date & Time */}
          <div
            style={{
              background: "#EFEFEF",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "0.75rem",
                fontWeight: "600",
                fontSize: "1.2rem",
                color: "#333",
              }}
            >
              Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                fontSize: "1.1rem",
                border: "2px solid #C4C4C4",
                borderRadius: "8px",
                background: "white",
                fontFamily: '"SF Pro", serif',
              }}
            />
          </div>

          {/* Location */}
          <div
            style={{
              background: "#EFEFEF",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "0.75rem",
                fontWeight: "600",
                fontSize: "1.2rem",
                color: "#333",
              }}
            >
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                fontSize: "1.1rem",
                border: "2px solid #C4C4C4",
                borderRadius: "8px",
                background: "white",
                fontFamily: '"SF Pro", serif',
              }}
            />
          </div>

          {/* Categories Selection */}
          <div
            style={{
              background: "#EFEFEF",
              borderRadius: "12px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "0.75rem",
                fontWeight: "600",
                fontSize: "1.2rem",
                color: "#333",
              }}
            >
              Event Categories *
            </label>
            <p
              style={{ fontSize: "1rem", color: "#666", marginBottom: "1rem" }}
            >
              Select categories that best describe your event
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              {categories.map((category) => (
                <label
                  key={category}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1rem 1.25rem",
                    border: "2px solid",
                    borderColor: formData.categories.includes(category)
                      ? "#6C7DC6"
                      : "#C4C4C4",
                    borderRadius: "10px",
                    cursor: "pointer",
                    background: formData.categories.includes(category)
                      ? "#F0F2FF"
                      : "white",
                    transition: "all 0.2s",
                    fontSize: "1.05rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    style={{
                      marginRight: "0.75rem",
                      width: "18px",
                      height: "18px",
                    }}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                padding: "1rem 2.5rem",
                fontSize: "1.1rem",
                borderRadius: "8px",
                border: "2px solid #999",
                background: "white",
                color: "#333",
                cursor: "pointer",
                fontWeight: "500",
                fontFamily: '"SF Pro", serif',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.categories.length === 0}
              style={{
                padding: "1rem 2.5rem",
                fontSize: "1.1rem",
                borderRadius: "8px",
                border: "none",
                background: "#6C7DC6",
                color: "white",
                cursor:
                  loading || formData.categories.length === 0
                    ? "not-allowed"
                    : "pointer",
                opacity: loading || formData.categories.length === 0 ? 0.6 : 1,
                fontWeight: "500",
                fontFamily: '"SF Pro", serif',
              }}
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>

          {formData.categories.length === 0 && (
            <p
              style={{
                color: "#dc3545",
                fontSize: "0.95rem",
                marginTop: "0.75rem",
                textAlign: "right",
              }}
            >
              Please select at least one category
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
