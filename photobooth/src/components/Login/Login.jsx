import React, { useState, useEffect } from "react";

export default function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check if user is already logged in when component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      console.log("Found stored token, verifying...");
      verifyToken(storedToken);
    }
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await fetch(
        "https://photobooth-lx7n9.ondigitalocean.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: tokenToVerify }),
        }
      );

      console.log("Token verification response:", response.status);
      const data = await response.json();
      console.log("Token verification data:", data);

      if (response.ok && data.status === "ok") {
        setToken(tokenToVerify);
        setIsLoggedIn(true);
        console.log("Token is valid, user logged in automatically");
      } else {
        console.log("Token verification failed, removing from storage");
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setToken(null);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
      setToken(null);
    }
  };

  const fetchLogin = async () => {
    try {
      setError("");
      console.log("Attempting login with:", { email, password });

      const response = await fetch(
        "https://photobooth-lx7n9.ondigitalocean.app/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      console.log("Login response status:", response.status);
      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok && data.data && data.data.token) {
        const receivedToken = data.data.token;
        setToken(receivedToken);
        setIsLoggedIn(true);
        localStorage.setItem("authToken", receivedToken);
        console.log(
          "Login successful, token stored:",
          receivedToken.substring(0, 20) + "..."
        );
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
        console.log("Login failed:", data);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Network error. Please try again.");
    }
  };

  const handleLogout = () => {
    console.log("Logging out, clearing storage");
    setToken(null);
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    localStorage.removeItem("authToken");
  };

  // Show logged in content
  if (isLoggedIn) {
    return (
      <div className="container">
        <div className="loginBox">
          <h2>Welcome! You are logged in.</h2>
          <p>Your session is saved in the browser.</p>
          <button onClick={handleLogout}>Logout</button>
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
        <button onClick={fetchLogin}>Login</button>
        <p style={{ fontSize: "12px", marginTop: "10px" }}>
          Try: admin@mediacollege.dk / admin or guest@mediacollege.dk / guest
        </p>
      </div>
    </div>
  );
}
