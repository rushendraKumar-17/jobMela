// import { Try } from "@mui/icons-material";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";


// Create the AuthContext with default value
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
 
  const [user, setUser] = useState(null); // Initialize user state
  const [loading,setLoading] = useState(true);
  const updateUser = (user)=>{
    setUser(user);
  }
  const apiurl = "http://localhost:8000"; // Base URL for API requests
  // const apiurl = "https://47dhks5r-8000.inc1.devtunnels.ms"; // Base URL for API requests
  // Function to log in the user
  const login = (userData) => {
    localStorage.setItem("token", userData.token); // Store token in localStorage
    console.log(userData.user);
    setUser(userData.user);
    // console.log(userData.user);
    
    
  };

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setUser(null);
  };
  const getUserDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (token) {
        const response = await axios.get(`${apiurl}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        });
        // console.log(response)

        if (response) {
          // console.log(response);
          setUser(response.data.user); // Set user data in state
        } else {
          console.error("Failed to fetch user details");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    
    getUserDetails();
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, logout, apiurl,updateUser,loading }}>
      {children}
    </AuthContext.Provider>
  );
};
