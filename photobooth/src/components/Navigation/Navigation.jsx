import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../Navigation/Navigation.module.css";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      {/* Burger Button */}
      <button onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </button>

      {/* Menu Items */}
      <div>
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Home
        </Link>
        <Link
          to="/login"
          onClick={() => setIsOpen(false)}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#555")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
