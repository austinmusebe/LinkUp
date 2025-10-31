import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    user?.profilePicture || ""
  );

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

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);

      // Upload immediately
      try {
        const response = await axios.post(
          "http://localhost:3000/api/users/profile-picture",
          {
            image: base64String,
          }
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
        : [...prev, category]
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
        }
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
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>My Profile</h2>

      {success && (
        <div
          style={{
            padding: "1rem",
            background: "#d4edda",
            borderRadius: "8px",
            marginBottom: "1rem",
            color: "#155724",
          }}
        >
          ✅ Profile updated successfully!
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "1rem",
            background: "#f8d7da",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Profile Picture Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          padding: "2rem",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #646cff",
              }}
            />
          ) : (
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "#ddd",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                color: "#999",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <label
          style={{
            padding: "0.5rem 1rem",
            background: "#646cff",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          Upload Profile Picture
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        {/* Name Field */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
          />
        </div>

        {/* Email Field (read-only) */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "1rem",
              background: "#f5f5f5",
              color: "#888",
            }}
          />
          <small style={{ color: "#888" }}>Email cannot be changed</small>
        </div>

        {/* Interests Section */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Interests & Categories
          </label>
          <p
            style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}
          >
            Select categories that interest you. This will help us recommend
            relevant events.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {categories.map((category) => (
              <label
                key={category}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.75rem",
                  border: "2px solid",
                  color: "#000000",
                  borderColor: interests.includes(category)
                    ? "#646cff"
                    : "#ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: interests.includes(category)
                    ? "#f0f0ff"
                    : "white",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={interests.includes(category)}
                  onChange={() => toggleInterest(category)}
                  style={{ marginRight: "0.5rem" }}
                />
                <span style={{ fontSize: "0.9rem" }}>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* Account Info */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f5f5f5",
          borderRadius: "8px",
          fontSize: "0.9rem",
          color: "#666",
        }}
      >
        <strong>Account Created:</strong>{" "}
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
      </div>
    </div>
  );
}

export default Profile;
