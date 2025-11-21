import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  return (
    <div className="App">
      <main>{children}</main>
    </div>
  );
}

export default Layout;
