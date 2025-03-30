import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  username:string;
  phone: string;
  type: 'tenant' | 'maintainer' | 'noerole';
  house_id: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasJoinedHouse: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setHasJoinedHouse: (status: boolean) => void;
  
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasJoinedHouse: false,
      setUser: (user) => 
        set({ user, isAuthenticated: !!user }),
      setToken: (token) => 
        set({ token }),
      setHasJoinedHouse: (status) => 
        set({ hasJoinedHouse: status }),
      logout: () => 
        set({ user: null, token: null, isAuthenticated: false}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage)    }
  )
);