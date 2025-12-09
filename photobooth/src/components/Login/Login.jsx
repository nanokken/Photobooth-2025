import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { isLoggedIn, login, logout, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    console.log("Attempting login with:", { email, password });

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
    } else {
      // Clear form on successful login
      setEmail("");
      setPassword("");
    }
  };

  // If logged in, show welcome message (or return null if you want to hide completely)
  if (isLoggedIn) {
    return (
      <div className="container">
        <div className="loginBox">
          <h2>Welcome! You are logged in.</h2>
          <p>Token: {token?.substring(0, 30)}...</p>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  // Show login form
  return (
    <div className="container">
      <div className="loginBox">
        <div className="inputArea">
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
        <div className="inputArea">
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleLogin}>Login</button>
        <p style={{ fontSize: "12px", marginTop: "10px" }}>
          Try: admin@mediacollege.dk / admin or guest@mediacollege.dk / guest
        </p>
      </div>
    </div>
  );
}
