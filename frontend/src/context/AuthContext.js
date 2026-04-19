import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API_URL}/auth/me`)
        .then(res => setUser(res.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('token', t);
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t);
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    // Si needsVerification → retourner tel quel, la page gère l'étape 2
    if (res.data.needsVerification) return res.data;
    const { token: t, user: u } = res.data;
    localStorage.setItem('token', t);
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t);
    setUser(u);
    return u;
  };

  const verifyEmail = async (email, code) => {
    const res = await axios.post(`${API_URL}/auth/verify-email`, { email, code });
    const { token: t, user: u } = res.data;
    localStorage.setItem('token', t);
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data.user);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, verifyEmail, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { API_URL };
