// hooks/useBatchImageUrls.ts
import { useState, useEffect } from 'react';
import { imageService } from '@/services/api/image.service';

export function useBatchImageUrls(fileKeys: string[] | null | undefined) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear the URLs if file keys are not provided
    if (!fileKeys || fileKeys.length === 0) {
      setUrls({});
      return;
    }

    // Fetch image URLs
    const fetchImageUrls = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await imageService.getBatchImageUrls(fileKeys);
        
        if (response && response.images) {
          // Convert array of images to a map of fileKey -> url
          const urlMap = response.images.reduce((acc, image) => {
            if (image.fileKey && image.url) {
              acc[image.fileKey] = image.url;
            }
            return acc;
          }, {} as Record<string, string>);
          
          setUrls(urlMap);
        } else {
          setError('Failed to retrieve image URLs');
        }
      } catch (err) {
        console.error('[useBatchImageUrls] Error fetching image URLs:', err);
        setError(err.message || 'An error occurred while fetching the image URLs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageUrls();
  }, [fileKeys ? JSON.stringify(fileKeys) : null]); // Re-run when fileKeys changes

  // Function to manually refresh URLs
  const refreshUrls = async () => {
    if (!fileKeys || fileKeys.length === 0) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await imageService.getBatchImageUrls(fileKeys);
      
      if (response && response.images) {
        const urlMap = response.images.reduce((acc, image) => {
          if (image.fileKey && image.url) {
            acc[image.fileKey] = image.url;
          }
          return acc;
        }, {} as Record<string, string>);
        
        setUrls(urlMap);
      } else {
        setError('Failed to refresh image URLs');
      }
    } catch (err) {
      console.error('[useBatchImageUrls] Error refreshing image URLs:', err);
      setError(err.message || 'An error occurred while refreshing the image URLs');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    urls,
    isLoading,
    error,
    refreshUrls,
    getUrl: (fileKey: string) => urls[fileKey] || null
  };
}