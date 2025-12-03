import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import PhotoCarousel from "./pages/PhotoCarousel";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choosecarousel" element={<PhotoCarousel />} />
        <Route path="/carousel/:id" element={<PhotoCarousel />} />
      </Routes>
    </Router>
  );
}
