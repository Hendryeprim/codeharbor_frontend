import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthToken, getAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getAuthToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await authAPI.getMe();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setAuthToken(null);
          setTokenState(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Failed to restore session:', err.message);
        setAuthToken(null);
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    if (data.success && data.token) {
      setAuthToken(data.token);
      setTokenState(data.token);
      setUser(data.user);
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    if (data.success && data.token) {
      setAuthToken(data.token);
      setTokenState(data.token);
      setUser(data.user);
      return data;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setAuthToken(null);
      setTokenState(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const data = await authAPI.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (e) {
      console.error('Refresh user error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isCustomer: user?.role === 'CUSTOMER',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

