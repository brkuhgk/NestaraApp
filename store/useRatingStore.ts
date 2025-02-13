// src/store/useRatingStore.ts
import {create} from 'zustand';

interface RatingParameters {
  rp1: number; // Cleanliness
  rp2: number; // Behavior and cooperation
  rp3: number; // Rental payment history
  rp4: number; // Maintenance timeliness
  rp5: number; // Communication
  mp1?: number; // Maintainer - Communication
  mp2?: number; // Maintainer - Behavior
  mp3?: number; // Maintainer - Maintenance timeliness
}

interface RatingHistory {
  id: string;
  userId: string;
  parameter: keyof RatingParameters;
  oldValue: number;
  newValue: number;
  reason: string;
  date: string;
}

interface RatingState {
  userRatings: Record<string, RatingParameters>; // key: userId
  ratingHistory: Record<string, RatingHistory[]>; // key: userId
  
  // Actions
  updateRating: (userId: string, parameter: keyof RatingParameters, value: number) => void;
  addRatingHistory: (userId: string, history: RatingHistory) => void;
  getRatingHistory: (userId: string) => RatingHistory[];
  getUserRating: (userId: string) => RatingParameters | null;
  calculateAverageRating: (userId: string) => number;
}

export const useRatingStore = create<RatingState>((set, get) => ({
  userRatings: {},
  ratingHistory: {},

  updateRating: (userId, parameter, value) => set((state) => ({
    userRatings: {
      ...state.userRatings,
      [userId]: {
        ...state.userRatings[userId],
        [parameter]: value
      }
    }
  })),

  addRatingHistory: (userId, history) => set((state) => ({
    ratingHistory: {
      ...state.ratingHistory,
      [userId]: [
        ...(state.ratingHistory[userId] || []),
        history
      ]
    }
  })),

  getRatingHistory: (userId) => {
    return get().ratingHistory[userId] || [];
  },

  getUserRating: (userId) => {
    return get().userRatings[userId] || null;
  },

  calculateAverageRating: (userId) => {
    const ratings = get().userRatings[userId];
    if (!ratings) return 0;

    const values = Object.values(ratings).filter(v => typeof v === 'number');
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
}));