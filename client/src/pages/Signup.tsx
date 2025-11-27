import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import signupBackground from "../assets/images/signup-background.jpg";
import linkEmoji from "../assets/link-emoji.png";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
    );

    if (result.success) {
      navigate("/profile"); // Redirect to profile to set interests
    } else {
      setError(result.error || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundImage: `url(${signupBackground})`,
        justifyContent: "center",
        flexDirection: "column",
        backgroundSize: "100vw",
      }}
    >
      <div
        style={{
          backgroundColor: "#cfdcf2",
          borderRadius: "6px",
          justifySelf: "center",
          fontFamily: "SF Pro, serif",
          padding: "50px",
          opacity: "95%",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "48px",
              fontFamily: "SF Pro Display",
              fontWeight: "bolder",
            }}
          >
            Link Up
          </h2>
          <img
            src={linkEmoji}
            alt="link emoji"
            style={{
              width: "48px",
              height: "48px",
            }}
          />
        </div>

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

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          <div style={{ marginBottom: "1rem" }}>
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
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
            />
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
