import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      {/* Burger Button */}
      <button
        className={styles.burgerButton}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className={`${styles.line} ${isOpen ? styles.line1 : ""}`}></div>
        <div className={`${styles.line} ${isOpen ? styles.line2 : ""}`}></div>
        <div className={`${styles.line} ${isOpen ? styles.line3 : ""}`}></div>
      </button>

      {/* Menu Items */}
      <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
        <Link
          to="/"
          className={styles.menuItem}
          onClick={() => setIsOpen(false)}
        >
          🏠 Home
        </Link>
        {isLoggedIn ? (
          <>
            <Link
              to="/admin-panel"
              className={styles.menuItem}
              onClick={() => setIsOpen(false)}
            >
              ⚙️ Admin Panel
            </Link>
            <button
              className={styles.logoutButton}
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={styles.menuItem}
            onClick={() => setIsOpen(false)}
          >
            🔑 Login
          </Link>
        )}
      </div>
    </nav>
  );
}
