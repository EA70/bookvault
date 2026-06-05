

import { createContext, useState, useEffect } from 'react';
import api from '../services/api'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (tokenToUse) => {
    const token = tokenToUse || localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/me'); 
      // Important: conserver le token pour les pages qui l'utilisent (ex: admin).
      setUser({ ...response.data, token });
    } catch (err) {
      console.error("Session expirée ou invalide");
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (userData) => {
    if (userData.token) {
      localStorage.setItem('token', userData.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      
      await fetchUserProfile(userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem("buchvault_cart");
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshProfile: fetchUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};