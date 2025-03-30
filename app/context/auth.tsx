// app/context/auth.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { useHouseStore } from '@/store/useHouseStore';

type AuthContextType = {
  isAuthenticated: boolean |null;
  hasJoinedHouse: boolean;
  login: (token: string) => void;
  register: (token: string) => void;
  joinHouse: () => void;
  logout: () => void;
};


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasJoinedHouse, setHasJoinedHouse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentHouse } = useHouseStore(); // Add this line to get setCurrentHouse

  useEffect(() => {
    checkAuthStatus();
}, []);

  
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };





const login = async (token: string) => {
  try {
      await AsyncStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
      console.log('Logged in');
  } catch (error) {
      console.error('Error saving token:', error);
  }
};

const register = async (token: string) => {
  try {
      await AsyncStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
      console.log('Registered');
  } catch (error) {
      console.error('Error saving token:', error);
  }
};

const joinHouse = () => {
  setHasJoinedHouse(true);
  console.log('Joined house');
};

const logout = async () => {
  try {
      await AsyncStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      setCurrentHouse(null);
      setHasJoinedHouse(false);
      console.log('Logged out');
  } catch (error) {
      console.error('Error removing token:', error);
  }
};

if (isLoading) {
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
      </View>
  );
}

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
function setCurrentHouse(arg0: null) {
  throw new Error('Function not implemented.');
}

