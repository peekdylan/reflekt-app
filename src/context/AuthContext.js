import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// AuthContext provides the logged-in user's info and auth functions
// to any screen in the app without having to pass props manually
const AuthContext = createContext(null);

// AuthProvider wraps the entire app and manages authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // The logged-in user's info
  const [token, setToken] = useState(null);     // The JWT token
  const [loading, setLoading] = useState(true); // True while checking stored token on startup

  // On app startup, check if there's a saved token in AsyncStorage
  // This keeps the user logged in between app sessions
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load stored auth:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Called after successful login or register
  // Saves the token and user info both in state and AsyncStorage
  const signIn = async (userData) => {
    try {
      await AsyncStorage.setItem('token', userData.token);
      await AsyncStorage.setItem('user', JSON.stringify({
        id: userData.id,
        email: userData.email,
        name: userData.name,
      }));
      setToken(userData.token);
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
      });
    } catch (error) {
      console.error('Failed to save auth:', error);
    }
  };

  // Called when the user logs out
  // Clears everything from state and AsyncStorage
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear auth:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — lets any screen access auth state with a single line:
// const { user, signIn, signOut } = useAuth();
export const useAuth = () => useContext(AuthContext);