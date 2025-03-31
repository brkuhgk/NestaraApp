import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useImageUrl } from '@/hooks/useImageUrl';

interface AvatarProps {
  imageKey?: string | null;
  imageUrl?: string | null;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  imageKey,
  imageUrl,
  size = 50,
  borderColor = '#FFFFFF',
  borderWidth = 2
}) => {
  // If imageUrl is directly provided, use it. Otherwise, fetch from imageKey
  const { url, isLoading } = useImageUrl(imageKey);
  
  // Use provided imageUrl, or the fetched url, or fallback to placeholder
  const displayUrl = imageUrl || url || `https://placehold.jp/3d4070/ffffff/${size}x${size}.png`;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          borderWidth,
        },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#2563EB" />
      ) : (
        <Image
          source={{ uri: displayUrl }}
          style={[
            styles.image,
            {
              width: size - borderWidth * 2,
              height: size - borderWidth * 2,
              borderRadius: (size - borderWidth * 2) / 2,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
});