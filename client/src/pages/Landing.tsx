import { Link } from "react-router-dom";
import calendarEmoji from "../assets/calendar-emoji.png";
import computerEmoji from "../assets/computer-emoji.png";
import linkEmoji from "../assets/link-emoji.png";

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
          {/*<a
            className="landing-nav-item"
            href="#conferences"
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
            Conferences
          </a>
          <a
            className="landing-nav-item"
            href="#plots"
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
            Plots
          </a>*/}
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
      {/* --- NEW GRADIENT BACKGROUND --- */}
      <div
        style={{
          position: "absolute",
          top: "130px", // 100px assumed nav height + 30px
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, #000000, #CFDCF2)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          zIndex: 1, // Sit behind hero content
        }}
      />
      {/* --- END NEW GRADIENT BACKGROUND --- */}

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
        {/* Floating Card - Left */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "15%",
            width: "150px",
            height: "150px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-15deg)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "float 6s ease-in-out infinite",
          }}
        >
          <div
            style={{ fontSize: "4rem", filter: "grayscale(1) brightness(1.2)" }}
          >
            <img src={calendarEmoji} alt="calendarEmoji" />
          </div>
        </div>

        {/* Floating Card - Right */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "12%",
            width: "180px",
            height: "180px",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(15deg)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "float 6s ease-in-out infinite 1s",
          }}
        >
          <div
            style={{ fontSize: "4rem", filter: "grayscale(1) brightness(1.2)" }}
          >
            <img src={computerEmoji} alt="Computer Emoji" />
          </div>
        </div>

        {/* Center Chain Icon */}
        <div
          style={{
            marginBottom: "3rem",
            fontSize: "6rem",
            animation: "float 5s ease-in-out infinite",
            filter: "drop-shadow(0 4px 20px rgba(255,255,255,0.1))",
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
            color: "rgba(255,255,255,0.6)",
            marginBottom: "3rem",
            textAlign: "center",
            fontFamily: "'SF Pro', serif",
          }}
        >
          Fill up your calendar and grow quicker.
        </p>

        {/* CTA Button */}
        <Link to="/signup" style={{ textDecoration: "none" }}>
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
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotation, 0deg));
          }
        }
      `}</style>
    </div>
  );
}

export default Landing;
