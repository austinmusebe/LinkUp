import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="App">
      <header
        style={{
          borderBottom: "2px solid #646cff",
          paddingBottom: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h1>LinkUp - Your Event Hub</h1>
        <nav
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "#646cff" }}>
            Events
          </Link>
          <Link
            to="/create"
            style={{ textDecoration: "none", color: "#646cff" }}
          >
            Create Event
          </Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
