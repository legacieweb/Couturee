import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent login
    const storedUser = localStorage.getItem('shabil_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await api.login(credentials);
    if (data.user && data.token) {
      setUser(data.user);
      localStorage.setItem('shabil_user', JSON.stringify(data.user));
      localStorage.setItem('shabil_token', data.token);
      return data;
    }
    throw new Error(data.error || 'Login failed');
  };

  const signup = async (userData) => {
    const data = await api.signup(userData);
    if (data.user && data.token) {
      setUser(data.user);
      localStorage.setItem('shabil_user', JSON.stringify(data.user));
      localStorage.setItem('shabil_token', data.token);
      return data;
    }
    throw new Error(data.error || 'Signup failed');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shabil_user');
    localStorage.removeItem('shabil_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
