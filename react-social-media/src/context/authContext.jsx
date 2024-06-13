import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null 
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });
    console.log("Login response data:", res.data); 
    setCurrentUser(res.data);
  };

  const logout = async () => {
    await axios.post("http://localhost:8800/api/auth/logout", {}, {
      withCredentials: true,
    });
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const fetchCurrentUser = async (inputs) => {
      try {
        const res = await axios.get("http://localhost:8800/api/auth/currentUser", {
          withCredentials: true,
        });
        console.log("Fetch current user data:", res.data);
        setCurrentUser(res.data);
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
