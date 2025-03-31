// hooks/useImageUrl.ts
import { useState, useEffect } from 'react';
import { imageService } from '@/services/api/image.service';

export function useImageUrl(fileKey: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear the URL if the file key is not provided
    if (!fileKey) {
      setUrl(null);
      return;
    }

    // Function to fetch the image URL
    const fetchImageUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const imageUrl = await imageService.getImageUrl(fileKey);
        
        if (imageUrl) {
          setUrl(imageUrl);
        } else {
          setUrl(null);
          console.log('[useImageUrl] No URL returned for key:', fileKey);
          // Use a fallback placeholder instead of showing an error
          setUrl('https://placehold.jp/3d4070/ffffff/150x150.png');
        }
      } catch (err) {
        console.error('[useImageUrl] Error fetching image URL:', err);
        setError(err.message || 'An error occurred while fetching the image URL');
        // Provide a fallback URL
        setUrl('https://placehold.jp/3d4070/ffffff/150x150.png');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageUrl();
  }, [fileKey]);

  // Function to manually refresh the URL
  const refreshUrl = async () => {
    if (!fileKey) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const imageUrl = await imageService.getImageUrl(fileKey);
      
      if (imageUrl) {
        setUrl(imageUrl);
      } else {
        setUrl('https://placehold.jp/3d4070/ffffff/150x150.png');
      }
    } catch (err) {
      console.error('[useImageUrl] Error refreshing image URL:', err);
      setError(err.message || 'An error occurred while refreshing the image URL');
      setUrl('https://placehold.jp/3d4070/ffffff/150x150.png');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    url,
    isLoading,
    error,
    refreshUrl
  };
}