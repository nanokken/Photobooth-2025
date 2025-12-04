import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import Navigation from "./components/Navigation/Navigation";
import Login from "./components/Login/Login";

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
          <Route path="/login" element={<Login />} />
          <Route path="/carousel" element={<PhotoCarousel />} />
          <Route path="/photobooth/:id" element={<Photobooth />} />
          <Route path="/admin-event" element={<AdminEvent />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
