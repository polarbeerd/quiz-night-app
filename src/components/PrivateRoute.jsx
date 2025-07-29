import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isDemo = localStorage.getItem("demo") === "true";

  // Block demo users
  if (isDemo) {
    return <Navigate to="/login" replace />;
  }

  // Allow real users
  return children;
}
