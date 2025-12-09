import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isLoggedIn, login, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = async () => {
    setError("");
    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
    } else {
      // Clear form and close login
      setEmail("");
      setPassword("");
      setShowLogin(false);
      setIsOpen(false);
    }
  };

  const openLogin = () => {
    setShowLogin(true);
    setError("");
  };

  const closeLogin = () => {
    setShowLogin(false);
    setEmail("");
    setPassword("");
    setError("");
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
        <Link
          to="/carousel?eventSlug=skolefest-2025"
          className={styles.menuItem}
          onClick={() => setIsOpen(false)}
        >
          📸 Carousel
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

            {/* 👇 AICI E NOUL LINK CĂTRE PAGINA DE EVENTURI */}
            <Link
              to="/admin-event"
              className={styles.menuItem}
              onClick={() => setIsOpen(false)}
            >
              🎄 Admin Events
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
          <button className={styles.loginTrigger} onClick={openLogin}>
            🔑 Login
          </button>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && !isLoggedIn && (
        <div className={styles.loginModal}>
          <div className={styles.loginBox}>
            <button className={styles.closeButton} onClick={closeLogin}>
              ×
            </button>
            <h3>Login</h3>
            <div className={styles.inputArea}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="admin@mediacollege.dk"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputArea}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="admin"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.loginButton} onClick={handleLogin}>
              Login
            </button>
            <p className={styles.hint}>
              Try: admin@mediacollege.dk / admin or guest@mediacollege.dk /
              guest
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
