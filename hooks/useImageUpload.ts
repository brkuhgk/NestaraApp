// hooks/useImageUpload.ts
import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions
} from 'react-native-image-picker';
import { imageService } from '@/services/api/image.service';

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [imageKey, setImageKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simple direct upload without Promise wrapping
  const uploadImageToS3 = async (uri: string, fileType: string, folder: string) => {
    try {
      setIsUploading(true);
      setError(null);
      
      console.log('[useImageUpload] Getting upload URL for', uri);
      // Get pre-signed upload URL
      const uploadUrlResponse = await imageService.getUploadUrl(fileType, folder);
      console.log('[useImageUpload] Upload URL response:', uploadUrlResponse);
      const { uploadUrl, fileKey } = uploadUrlResponse;
      
      console.log('[useImageUpload] Uploading image to S3', uploadUrl);
      // Upload the image directly to S3
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('[useImageUpload] Blob created from image:', blob);
      await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': fileType,
        },
      });
      var fileNameOnly = fileKey.split('/').pop();
      console.log('[useImageUpload] Image uploaded successfully, keyname:', fileNameOnly);
      setImageKey(fileNameOnly);
      return { imageKey: fileNameOnly, uri };
    } catch (err) {
      console.error('[useImageUpload] Upload error:', err);
      setError('Failed to upload image: ' + (err.message || 'Unknown error'));
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const pickFromGallery = async (folder: string = 'general') => {
    try {
      setError(null);
      
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: false,
        selectionLimit: 1,
        maxHeight: 1200,
        maxWidth: 1200,
        quality: 0.8,
        presentationStyle: 'fullScreen'
      };
      
      return new Promise<{ imageKey: string; uri: string } | null>((resolve) => {
        launchImageLibrary(options, (response) => {
          console.log('[useImageUpload] Gallery response:', response);
          
          if (response.didCancel) {
            console.log('[useImageUpload] User cancelled gallery picker');
            resolve(null);
            return;
          }
          
          if (response.errorCode) {
            console.error('[useImageUpload] Gallery error:', response.errorMessage);
            setError('Gallery error: ' + (response.errorMessage || 'Unknown error'));
            resolve(null);
            return;
          }
          
          if (!response.assets || response.assets.length === 0 || !response.assets[0].uri) {
            console.error('[useImageUpload] No image selected from gallery');
            setError('No image was selected');
            resolve(null);
            return;
          }
          
          const selectedImage = response.assets[0];
          const uri = selectedImage.uri as string;
          const fileType = selectedImage.type || 'image/jpeg';
          
          // Upload the image
          uploadImageToS3(uri, fileType, folder)
            .then(result => {
              resolve(result);
            })
            .catch(err => {
              console.error('[useImageUpload] Upload error in gallery flow:', err);
              setError('Failed to process selected image');
              resolve(null);
            });
        });
      });
    } catch (error) {
      console.error('[useImageUpload] Fatal error in pickFromGallery:', error);
      setError('Fatal error: ' + (error?.message || 'Unknown error'));
      return null;
    }
  };

  const captureFromCamera = async (folder: string = 'general') => {
    try {
      setError(null);
      
      const options: CameraOptions = {
        mediaType: 'photo',
        includeBase64: false,
        cameraType: 'back',
        maxHeight: 1200,
        maxWidth: 1200,
        quality: 0.8,
        saveToPhotos: true
      };
      
      return new Promise<{ imageKey: string; uri: string } | null>((resolve) => {
        launchCamera(options, (response) => {
          console.log('[useImageUpload] Camera response:', response);
          
          if (response.didCancel) {
            console.log('[useImageUpload] User cancelled camera');
            resolve(null);
            return;
          }
          
          if (response.errorCode) {
            console.error('[useImageUpload] Camera error:', response.errorMessage);
            setError('Camera error: ' + (response.errorMessage || 'Unknown error'));
            resolve(null);
            return;
          }
          
          if (!response.assets || response.assets.length === 0 || !response.assets[0].uri) {
            console.error('[useImageUpload] No image captured from camera');
            setError('No image was captured');
            resolve(null);
            return;
          }
          
          const capturedImage = response.assets[0];
          const uri = capturedImage.uri as string;
          const fileType = capturedImage.type || 'image/jpeg';
          
          // Upload the image
          uploadImageToS3(uri, fileType, folder)
            .then(result => {
              resolve(result);
            })
            .catch(err => {
              console.error('[useImageUpload] Upload error in camera flow:', err);
              setError('Failed to process captured image');
              resolve(null);
            });
        });
      });
    } catch (error) {
      console.error('[useImageUpload] Fatal error in captureFromCamera:', error);
      setError('Fatal error: ' + (error?.message || 'Unknown error'));
      return null;
    }
  };

  return {
    isUploading,
    imageKey,
    error,
    pickFromGallery,
    captureFromCamera
  };
}