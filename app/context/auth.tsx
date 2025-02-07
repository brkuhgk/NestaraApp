// app/context/auth.tsx
import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  hasJoinedHouse: boolean;
  login: () => void;
  register: () => void;
  joinHouse: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

import { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasJoinedHouse, setHasJoinedHouse] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
    console.log('Logged in');
  };

  const register = () => {
    setIsAuthenticated(true);
    console.log('Registered');
  };

  const joinHouse = () => {
    setHasJoinedHouse(true);
    console.log('Joined house');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHasJoinedHouse(true);
    console.log('Logged out');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      hasJoinedHouse, 
      login, 
      register, 
      joinHouse, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};