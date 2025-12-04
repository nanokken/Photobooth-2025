import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//importing the components
import Login from "./components/Login/Login.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

// Importing the pages
import Home from "./pages/Home/Home";
import PhotoCarousel from "./pages/PhotoCarousel/PhotoCarousel";
import Photobooth from "./pages/photobooth/Photobooth.jsx";
import AdminEvent from "./pages/AdminEvent/AdminEvent.jsx";
import AdminPanel from "./pages/AdminPanel/AdminPanel.jsx";
import Navigation from "./components/Navigation/Navigation.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carousel" element={<PhotoCarousel />} />
          <Route path="/photobooth" element={<Photobooth />} />
          <Route path="/admin-event" element={<AdminEvent />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
