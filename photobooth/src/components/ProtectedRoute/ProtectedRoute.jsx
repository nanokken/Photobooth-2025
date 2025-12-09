import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  // Show loading while checking auth status
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "white",
          fontSize: "1.5rem",
        }}
      >
        Loading...
      </div>
    );
  }

  // Redirect to home if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Render the protected component if logged in
  return children;
}
