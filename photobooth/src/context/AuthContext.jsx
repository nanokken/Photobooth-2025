import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      console.log("Found stored token, verifying...");
      verifyToken(storedToken);
    } else {
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(
        "https://photobooth-lx7n9.ondigitalocean.app/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.data && data.data.token) {
        const receivedToken = data.data.token;
        setToken(receivedToken);
        setIsLoggedIn(true);
        localStorage.setItem("authToken", receivedToken);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
  };

  const value = {
    isLoggedIn,
    token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
