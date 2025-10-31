import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    categories: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories
    axios
      .get("http://localhost:3000/api/categories")
      .then((response) => {
        if (response.data.success) {
          setCategories(response.data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch categories:", err));

    // Fetch event
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/events/${id}`
        );

        if (response.data.success) {
          const event = response.data.data;

          if (event.createdBy._id !== user?.id) {
            setError("You are not authorized to edit this event");
            setLoading(false);
            return;
          }

          const eventDate = new Date(event.date);
          const formattedDate = eventDate.toISOString().slice(0, 16);

          setFormData({
            title: event.title,
            description: event.description || "",
            date: formattedDate,
            location: event.location || "",
            categories: event.categories || [],
          });
        } else {
          setError(response.data.error || "Event not found");
        }
      } catch (err) {
        setError("Unable to fetch event");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

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
    setSaving(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/events/${id}`,
        {
          ...formData,
          date: new Date(formData.date),
        }
      );

      if (response.data.success) {
        navigate(`/events/${id}`);
      } else {
        setError(response.data.error || "Failed to update event");
      }
    } catch (err) {
      setError("Unable to update event");
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading event...</p>;
  }

  if (error && !formData.title) {
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
          <strong>❌ Error:</strong> {error}
        </div>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Edit Event</h2>

      {error && (
        <div
          style={{
            padding: "1rem",
            background: "#f8d7da",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
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
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Date & Time *
          </label>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
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
            style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
          />
        </div>

        {/* Categories Selection */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
          >
            Event Categories *
          </label>
          <p
            style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}
          >
            Select categories that best describe your event
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
                  borderColor: formData.categories.includes(category)
                    ? "#646cff"
                    : "#ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: formData.categories.includes(category)
                    ? "#f0f0ff"
                    : "white",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  style={{ marginRight: "0.5rem" }}
                />
                <span style={{ fontSize: "0.9rem" }}>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="submit"
            disabled={saving || formData.categories.length === 0}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              cursor:
                saving || formData.categories.length === 0
                  ? "not-allowed"
                  : "pointer",
              opacity: saving || formData.categories.length === 0 ? 0.6 : 1,
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/events/${id}`)}
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>

        {formData.categories.length === 0 && (
          <p
            style={{
              color: "#dc3545",
              fontSize: "0.85rem",
              marginTop: "0.5rem",
            }}
          >
            Please select at least one category
          </p>
        )}
      </form>
    </div>
  );
}

export default EditEvent;
