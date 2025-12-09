import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext.jsx";
import Navigation from "./components/Navigation/Navigation";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Importing the pages
import Home from "./pages/Home/Home";
import PhotoCarousel from "./pages/PhotoCarousel/PhotoCarousel";
import Photobooth from "./pages/photobooth/Photobooth.jsx";
import AdminEvent from "./pages/AdminEvent/AdminEvent.jsx";
import AdminPanel from "./pages/AdminPanel/AdminPanel.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carousel" element={<PhotoCarousel />} />
          <Route path="/photobooth/:id" element={<Photobooth />} />
          <Route
            path="/admin-event"
            element={
              <ProtectedRoute>
                <AdminEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
