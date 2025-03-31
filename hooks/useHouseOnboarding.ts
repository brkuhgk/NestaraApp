// hooks/useHouseOnboarding.ts
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { Camera } from 'expo-camera';
import { router } from 'expo-router';
import { houseService } from '@/services/api/house.service';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Custom hook for managing house onboarding (joining or creating houses)
 */
export const useHouseOnboarding = (onBoardingComplete: () => void) => {
  // User state
  const { user } = useAuthStore();
  
  // House creation states
  const [houseName, setHouseName] = useState('');
  const [address, setAddress] = useState('');
  const [verificationImage, setVerificationImage] = useState(null);
  
  // House joining states
  const [houseId, setHouseId] = useState('');
  
  // QR code states
  const [createdHouseId, setCreatedHouseId] = useState(null);
  const [qrVisible, setQrVisible] = useState(false);
  
  // Camera and scanner states
  const [scannerVisible, setScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  
  // Loading state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Take a verification photo for house creation
   */
  const takeVerificationPhoto = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: false,
    };
    
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      } else if (response.assets && response.assets.length > 0) {
        setVerificationImage(response.assets[0].uri);
      }
    });
  };

  /**
   * Request camera permission for QR code scanning
   */
  const requestScannerPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setScannerVisible(true);
    } else {
      Alert.alert('Permission required', 'Camera permission is needed to scan QR codes');
    }
  };

  /**
   * Handle barcode scanning for house joining
   */
  const handleBarCodeScanned = ({ type, data }) => {
    try {
      setScannerVisible(false);
      // Check if the scanned data is a valid house ID format
      if (data && data.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        setHouseId(data);
      } else {
        Alert.alert('Invalid QR Code', 'The scanned code is not a valid house ID');
      }
    } catch (error) {
      Alert.alert('Scan Error', 'Failed to process the scanned code');
    }
  };

  /**
   * Create a new house
   */
  const createHouse = async () => {
    if (!houseName || !address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Verification requirement commented out for now
    /*if (!verificationImage) {
      Alert.alert('Verification Required', 'Please take a photo of the house or utility bill for verification');
      return;
    }*/

    setLoading(true);
    setError(null);
    
    try {
      // Create the house (without verification for now)
      const houseData = {
        name: houseName,
        address: address,
        // verification_status: 'pending' // Commented out for now
      };
      
      const newHouse = await houseService.createHouse(houseData);
      setCreatedHouseId(newHouse.id);
      
      // Show the QR code for house joining
      setQrVisible(true);
      return newHouse;
    } catch (err) {
      const error = err as Error;
      console.error('Create house error:', error);
      setError(error.message || 'Failed to create house. Please try again.');
      Alert.alert('Error', error.message || 'Failed to create house. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Join an existing house
   */
  const joinExistingHouse = async () => {
    if (!houseId || houseId.trim() === '') {
      Alert.alert('Error', 'Please enter a house ID or scan a QR code');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Verify house exists before trying to join
      const house = await houseService.getHouse(houseId);
      
      if (!house) {
        Alert.alert('Error', 'House not found. Please check the ID and try again.');
        return null;
      }
      
      // Add user as a member of the house
      await houseService.addMember(houseId, user.id);
      
      Alert.alert(
        'Success',
        `You have joined ${house.name}`,
        [{ 
          text: "OK",
          onPress: () => {
            onBoardingComplete();
          }
        }]
      );
      
      return house;
    } catch (err) {
      const error = err as Error;
      console.error('Join house error:', error);
      setError(error.message || 'Failed to join house. Please try again.');
      Alert.alert('Error', error.message || 'Failed to join house. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Complete the onboarding process
   */
  const completeOnboarding = () => {
    setQrVisible(false);
    onBoardingComplete();
  };

  /**
   * Share house QR code
   */
  const shareHouseQRCode = () => {
    // This would be implemented with a share API
    Alert.alert('Share', 'Share functionality would go here');
  };

  return {
    // States
    houseName,
    setHouseName,
    address,
    setAddress,
    verificationImage,
    houseId,
    setHouseId,
    createdHouseId,
    qrVisible,
    scannerVisible,
    hasPermission,
    loading,
    error,
    
    // Actions
    takeVerificationPhoto,
    requestScannerPermission,
    handleBarCodeScanned,
    createHouse,
    joinExistingHouse,
    completeOnboarding,
    shareHouseQRCode,
    setScannerVisible,
    setQrVisible
  };
};