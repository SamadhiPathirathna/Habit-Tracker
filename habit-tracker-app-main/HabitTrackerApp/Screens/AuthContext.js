import React, { createContext, useState } from 'react';
import {
  login as loginAPI,
  register as registerAPI,
  getUserData,
  updateUser
} from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const loginUser = async (username, password) => {
    try {
      const response = await loginAPI(username, password);
      setUser(response.data.user);
      setToken(response.data.token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await registerAPI(userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const loadUserData = async () => {
    if (token) {
      try {
        const response = await getUserData(token);
        setUser(response.data);
      } catch (error) {
        console.error("Error loading user data:", error);
        throw error;
      }
    }
  };

  const updateUserProfile = async (userData) => {
    if (token) {
      try {
        const response = await updateUser(token, userData);
        setUser(response.data.user);
        return true;
      } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
      }
    }
    return false;
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginUser,
        registerUser,
        loadUserData,
        updateUserProfile,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
