import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  return (
    <div className="App">
      <header
        style={{
          borderBottom: "2px solid #646cff",
          paddingBottom: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h1> LinkUp - Your Event Hub</h1>
        <nav
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "#646cff" }}>
            Events
          </Link>

          {user ? (
            <>
              <Link
                to="/create"
                style={{ textDecoration: "none", color: "#646cff" }}
              >
                Create Event
              </Link>
              <Link
                to="/my-events"
                style={{ textDecoration: "none", color: "#646cff" }}
              >
                My Events
              </Link>
              <Link
                to="/profile"
                style={{ textDecoration: "none", color: "#646cff" }}
              >
                Profile
              </Link>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginLeft: "auto",
                }}
              >
                {user.profilePicture && (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <span style={{ color: "#888" }}>{user.name}</span>
                <button
                  onClick={logout}
                  style={{
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#646cff" }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "#646cff" }}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
