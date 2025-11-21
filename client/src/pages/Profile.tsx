import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import linkEmoji from "../assets/link-emoji.png";
import { FlagTriangleLeft } from "lucide-react";

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    user?.profilePicture || "",
  );
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    // Fetch available categories
    axios
      .get("http://localhost:3000/api/categories")
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

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/users/profile-picture",
          {
            image: base64String,
          },
        );

        if (response.data.success) {
          updateUser({ profilePicture: base64String });
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      } catch (err) {
        setError("Failed to upload profile picture");
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleInterest = (category: string) => {
    setInterests((prev) =>
      prev.includes(category)
        ? prev.filter((i) => i !== category)
        : [...prev, category],
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.put(
        "http://localhost:3000/api/users/profile",
        {
          name,
          interests,
        },
      );

      if (response.data.success) {
        updateUser(response.data.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
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
                border: "2px solid #6C7DC6",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
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
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "3rem 2rem",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "600",
            color: "#000000",
            marginBottom: "2rem",
            fontFamily: '"SF Pro", serif',
          }}
        >
          Manage Account
        </h1>

        {success && (
          <div
            style={{
              padding: "1rem 1.5rem",
              background: "#d4edda",
              borderRadius: "8px",
              marginBottom: "2rem",
              color: "#155724",
              fontSize: "1.1rem",
            }}
          >
            ✓ Profile updated successfully
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "1rem 1.5rem",
              background: "#f8d7da",
              borderRadius: "8px",
              marginBottom: "2rem",
              color: "#721c24",
              fontSize: "1.1rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Profile Picture Section */}
        <div
          style={{
            background: "#E8E8E8",
            borderRadius: "12px",
            padding: "2.5rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "600",
              marginBottom: "1.5rem",
              color: "#000",
            }}
          >
            Profile Picture
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: imagePreview ? "transparent" : "#C4C4C4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "3px solid #6C7DC6",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: "3rem",
                    color: "#666",
                    fontWeight: "600",
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#2d3a75")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#394A93")
              }
            >
              Upload New Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {/* Account Information */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: "#E8E8E8",
              borderRadius: "12px",
              padding: "2.5rem",
              marginBottom: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "1.5rem",
                color: "#000",
              }}
            >
              Account Information
            </h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  color: "#333",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  color: "#333",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  fontSize: "1.1rem",
                  background: "#F5F5F5",
                  color: "#666",
                  border: "2px solid #C4C4C4",
                  borderRadius: "8px",
                  fontFamily: '"SF Pro", serif',
                }}
              />
              <small
                style={{
                  color: "#666",
                  fontSize: "0.95rem",
                  marginTop: "0.5rem",
                  display: "block",
                }}
              >
                Email cannot be changed
              </small>
            </div>

            {user.createdAt && (
              <div
                style={{
                  padding: "1rem",
                  background: "#F5F5F5",
                  borderRadius: "8px",
                  marginTop: "1.5rem",
                }}
              >
                <span style={{ color: "#666", fontSize: "1rem" }}>
                  <strong>Member since:</strong>{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Interests Section */}
          <div
            style={{
              background: "#E8E8E8",
              borderRadius: "12px",
              padding: "2.5rem",
              marginBottom: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "0.75rem",
                color: "#000",
              }}
            >
              Interests & Preferences
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#666",
                marginBottom: "1.5rem",
                lineHeight: "1.6",
              }}
            >
              Select categories that interest you. We'll use these to recommend
              events tailored to your preferences.
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
                    borderColor: interests.includes(category)
                      ? "#6C7DC6"
                      : "#C4C4C4",
                    borderRadius: "10px",
                    cursor: "pointer",
                    background: interests.includes(category)
                      ? "#F0F2FF"
                      : "white",
                    transition: "all 0.2s",
                    fontSize: "1.05rem",
                    color: "black",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    if (!interests.includes(category)) {
                      e.currentTarget.style.borderColor = "#999";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!interests.includes(category)) {
                      e.currentTarget.style.borderColor = "#C4C4C4";
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={interests.includes(category)}
                    onChange={() => toggleInterest(category)}
                    style={{
                      marginRight: "0.75rem",
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                padding: "1rem 2.5rem",
                borderRadius: "8px",
                border: "2px solid #999",
                background: "white",
                color: "#333",
                fontSize: "1.1rem",
                cursor: "pointer",
                fontWeight: "500",
                fontFamily: '"SF Pro", serif',
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f5f5f5")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "1rem 2.5rem",
                borderRadius: "8px",
                border: "none",
                background: "#6C7DC6",
                color: "white",
                fontSize: "1.1rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                fontWeight: "500",
                fontFamily: '"SF Pro", serif',
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#5a6bb0";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "#6C7DC6";
              }}
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

export default Profile;
