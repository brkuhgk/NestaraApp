// services/api/user.service.ts
import api from './client';

interface UpdateProfileData {
  name?: string;
  bio?: string;
  image_key?: string;
}

export const userService = {
  getProfile: async () => {
    try {
      console.log('[UserService] Fetching user profile');
      return await api.get('/users/profile');
    } catch (error) {
      console.error('[UserService] Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (data: UpdateProfileData) => {
    try {
      console.log('[UserService] Updating profile with data:', data);
      return await api.put('/users/profile', data);
    } catch (error) {
      console.error('[UserService] Error updating profile:', error);
      throw error;
    }
  },

  getUserRatings: async (userId: string) => {
    try {
      console.log('[UserService] Fetching ratings for user:', userId);
      return await api.get(`/users/${userId}/ratings`);
    } catch (error) {
      console.error('[UserService] Error fetching user ratings:', error);
      throw error;
    }
  }
};

export default userService;