import axios from 'axios';

const API_BASE_URL = 'http://192.168.157.31:8070';

// Authentication APIs
export const register = (userData) =>
  axios.post(`${API_BASE_URL}/user/register`, userData, {
    headers: { 'Content-Type': 'application/json' },
  });

export const login = (username, password) =>
  axios.post(`${API_BASE_URL}/user/login`, { username, password });

export const getUserData = (token) =>
  axios.get(`${API_BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUser = (token, userData) =>
  axios.put(`${API_BASE_URL}/user/update/profile`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

// Habit Management APIs
export const fetchHabits = (token) =>
  axios.get(`${API_BASE_URL}/habit/gethabits`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addHabit = (token, habitDetails) =>
  axios.post(`${API_BASE_URL}/habit/addhabit`, habitDetails, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const editHabit = (token, habitId, updatedHabit) =>
  axios.put(`${API_BASE_URL}/habit/edit/${habitId}`, updatedHabit, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteHabit = (token, habitId) =>
  axios.delete(`${API_BASE_URL}/habit/deletehabit/${habitId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateHabitStatus = (token, habitId, status) =>
  axios.put(
    `${API_BASE_URL}/habit/status/${habitId}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  export const fetchRecommendations = (token) =>
    axios.get(`${API_BASE_URL}/habit/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
