import { Link } from "react-router-dom";
import calendarEmoji from "../assets/calendar-emoji.png";
import computerEmoji from "../assets/computer-emoji.png";
import linkEmoji from "../assets/link-emoji.png";
import landingOne from "../assets/images/landing-page-one.jpg";
import landingTwo from "../assets/images/landing-page-two.jpg";

function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#000000",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        fontFamily: "SF Pro",
        lineHeight: "1.6",
        letterSpacing: "0.5px",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 4rem",
          position: "relative",
          zIndex: 10,
          whiteSpace: "nowrap",
          fontWeight: 900,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.8rem",
            fontWeight: "900",
            color: "white",
          }}
        >
          <img
            src={linkEmoji}
            alt="link emoji"
            style={{
              width: "2rem",
            }}
          />
          LinkUp
        </div>

        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            alignItems: "center",
            fontSize: "1rem",
            fontFamily: "'SF Pro Display', serif",
          }}
        >
          <a
            className="landing-nav-item"
            href="/events"
            style={{
              color: "rgba(255,255,255,0.8)",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
            }
          >
            View Events
          </a>
          <Link
            to="/login"
            style={{
              color: "black",
              textDecoration: "none",
              padding: "0.5rem 1.2rem",
              borderRadius: "6px",
              background: "#3F72CA",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3F72CA")}
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            style={{
              color: "black",
              textDecoration: "none",
              padding: "0.5rem 1.2rem",
              borderRadius: "6px",
              background: "#3F72CA",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3F72CA")}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* --- BACKGROUND GRADIENT --- */}
      <div
        style={{
          position: "absolute",
          top: "130px",
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, #000000, #CFDCF2)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          zIndex: 1,
        }}
      />

      {/* Hero Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 100px)",
          padding: "2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* --- POLAROID LEFT --- */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "-5%", // Pushed partially off screen
            width: "25vw", // Dynamic width
            minWidth: "300px",
            height: "55vh", // Tall vertical look
            background: "#ffffff",
            padding: "1rem 1rem 3rem 1rem", // Extra padding bottom for polaroid look
            transform: "rotate(6deg)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {/* Polaroid Title */}
          <div
            style={{
              textAlign: "center",
              color: "#333",
              fontSize: "1.5rem",
              fontWeight: "600",
              fontFamily: "'Courier New', Courier, monospace", // Typewriter feel
              paddingBottom: "0.5rem",
            }}
          >
            Plan Ahead
          </div>
          {/* Polaroid Image Area */}
          <div
            style={{
              flex: 1,
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "1px solid #ddd",
            }}
          >
            <img
              src={landingOne}
              alt="Calendar"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* --- POLAROID RIGHT --- */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "-5%", // Pushed partially off screen
            width: "25vw",
            minWidth: "300px",
            height: "55vh",
            background: "#ffffff",
            padding: "1rem 1rem 3rem 1rem",
            transform: "rotate(-8deg)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {/* Polaroid Title */}
          <div
            style={{
              textAlign: "center",
              color: "#333",
              fontSize: "1.5rem",
              fontWeight: "600",
              fontFamily: "'Courier New', Courier, monospace",
              paddingBottom: "0.5rem",
            }}
          >
            Stay Connected
          </div>
          {/* Polaroid Image Area */}
          <div
            style={{
              flex: 1,
              background: "#f0f0f0", // Light gray background for image area
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "1px solid #ddd",
            }}
          >
            <img
              src={landingTwo}
              alt="Computer"
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Center Link Icon */}
        <div
          style={{
            marginBottom: "3rem",
            fontSize: "6rem",
            animation: "float 5s ease-in-out infinite",
            filter: "drop-shadow(0 4px 20px rgba(255,255,255,0.1))",
            zIndex: 10, // Ensure above photos
          }}
        >
          <img
            src={linkEmoji}
            alt="link emoji"
            style={{
              width: "6rem",
            }}
          />
        </div>

        {/* Hero Text */}
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "600",
            textAlign: "center",
            lineHeight: "1.2",
            marginBottom: "1.5rem",
            color: "white",
            zIndex: 10, // Ensure above photos
            textShadow: "0 4px 12px rgba(0,0,0,0.5)", // Added shadow for readability over photos if they overlap
          }}
        >
          Find, create and share
          <br />
          all in one place
          <br />
          together.
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "3rem",
            textAlign: "center",
            fontFamily: "'SF Pro', serif",
            zIndex: 10,
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Fill up your calendar and grow quicker.
        </p>

        {/* CTA Button */}
        <Link to="/signup" style={{ textDecoration: "none", zIndex: 10 }}>
          <button
            className="landing-join-button"
            style={{
              fontSize: "1.1rem",
              padding: "1rem 2.5rem",
              borderRadius: "8px",
              border: "none",
              background: "#9FBAE5",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#9FBAE5";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Join Now
          </button>
        </Link>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}

export default Landing;
