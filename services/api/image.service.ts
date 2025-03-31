// services/api/image.service.ts
import api from './client';

export interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
}

export interface ImageUrlResponse {
  url: string;
  expiresIn: number;
}

export const imageService = {
  // Get pre-signed URL for upload
  getUploadUrl: async (fileType: string, folder: string = 'general') => {
    try {
      console.log('[ImageService] Getting upload URL for:', { fileType, folder });
      const response = await api.post('/images/upload-url', { fileType, folder });
      console.log('[ImageService] Upload URL response:', response);
      return response.data;
    } catch (error) {
      console.error('[ImageService] Error getting upload URL:', error);
      throw error;
    }
  },

  // Get pre-signed URL for viewing image
  getImageUrl: async (fileKey: string) => {
    try {
      if (!fileKey) {
        console.warn('[ImageService] No file key provided');
        return null;
      }
      
      console.log('[ImageService] Getting image URL for:', fileKey);
      
      // Extract only the filename part if the key contains a path
      let requestKey = fileKey;
      if (fileKey.includes('/')) {
        // Get everything after the last slash
      requestKey = fileKey.split('/').pop();
      console.log('[ImageService] Extracted filename from path:', requestKey);
      }

      const response = await api.get(`/images/${requestKey}`);
      console.log('[ImageService] Image URL response:', response);
      
      if (response?.status === 'success') { 
        return response.data?.url;
      }
      
      return null;
    } catch (error) {
      console.error(`[ImageService] Error getting image URL for ${fileKey}:`, error);
      return null;
    }
  },

  // Get multiple image URLs
  getBatchImageUrls: async (fileKeys: string[]) => {
    try {
      if (!fileKeys || fileKeys.length === 0) {
        return { images: [], expiresIn: 0 };
      }
      
      console.log('[ImageService] Getting batch image URLs for:', fileKeys);
      const response = await api.post('/images/batch', { fileKeys });
      
      return response.data;
    } catch (error) {
      console.error('[ImageService] Error getting batch image URLs:', error);
      throw error;
    }
  },

  // Check if image exists
  checkImageExists: async (fileKey: string) => {
    try {
      if (!fileKey) return false;
      
      const response = await api.get(`/images/check/${fileKey}`);
      return response?.data?.exists || false;
    } catch (error) {
      console.error(`[ImageService] Error checking if image ${fileKey} exists:`, error);
      return false;
    }
  },

  // Delete image
  deleteImage: async (fileKey: string) => {
    try {
      if (!fileKey) return;
      console.log('[ImageService] Deleting image:', fileKey);
      await api.delete(`/images/${fileKey}`);
    } catch (error) {
      console.error(`[ImageService] Error deleting image ${fileKey}:`, error);
      throw error;
    }
  }
};

export default imageService;