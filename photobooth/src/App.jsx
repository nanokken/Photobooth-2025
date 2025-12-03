import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import PhotoCarousel from "./pages/PhotoCarousel/PhotoCarousel";
import Photobooth from "./pages/photobooth/Photobooth.jsx"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carousel" element={<PhotoCarousel />} />
        <Route path="/photobooth" element={<Photobooth />} />
      </Routes>
    </Router>
  );
}
