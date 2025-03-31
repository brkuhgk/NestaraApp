// app/orientation.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/app/context/auth';
import { Camera } from 'expo-camera';
import { QrCodeSvg } from 'react-native-qr-svg';
import { useHouseOnboarding } from '@/hooks/useHouseOnboarding';

const OrientationScreen = () => {
  const { joinHouse } = useAuth();
  const [activeScreen, setActiveScreen] = useState('select'); // 'select', 'join', 'create'
  
  // Use our custom hook for house onboarding logic
  const houseOnboarding = useHouseOnboarding(() => {
    joinHouse(); // Set joined house state in auth context
    router.replace('/(tabs)'); // Navigate to main app
  });

  // Render the selection screen
  const renderSelectionScreen = () => (
    <>
      <Text style={styles.title}>Get Started</Text>
      <Text style={styles.subtitle}>Choose an option to continue</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => setActiveScreen('join')}
        >
          <Icon name="users" size={40} color="#2563EB" />
          <Text style={styles.optionTitle}>Join a House</Text>
          <Text style={styles.optionDescription}>
            Join an existing household by entering the house ID or scanning a QR code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => setActiveScreen('create')}
        >
          <Icon name="home" size={40} color="#2563EB" />
          <Text style={styles.optionTitle}>Create a House</Text>
          <Text style={styles.optionDescription}>
            Set up a new household and invite roommates to join you
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // Render the join house screen
  const renderJoinScreen = () => (
    <>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setActiveScreen('select')}
      >
        <Icon name="arrow-left" size={24} color="#4B5563" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Join a House</Text>
      <Text style={styles.subtitle}>Enter house ID or scan QR code</Text>
      
      <View style={styles.inputContainer}>
        <Icon name="hash" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.input}
          placeholder="House ID"
          value={houseOnboarding.houseId}
          onChangeText={houseOnboarding.setHouseId}
          editable={!houseOnboarding.loading}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={houseOnboarding.requestScannerPermission}
        disabled={houseOnboarding.loading}
      >
        <Icon name="camera" size={20} color="#FFFFFF" />
        <Text style={styles.scanButtonText}>Scan QR Code</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, houseOnboarding.loading && styles.buttonDisabled]}
        onPress={houseOnboarding.joinExistingHouse}
        disabled={houseOnboarding.loading}
      >
        <Text style={styles.actionButtonText}>
          {houseOnboarding.loading ? 'Joining...' : 'Join House'}
        </Text>
      </TouchableOpacity>
      
      {/* QR Code Scanner Modal */}
      <Modal visible={houseOnboarding.scannerVisible} animationType="slide">
        <SafeAreaView style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity
              onPress={() => houseOnboarding.setScannerVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Scan House QR Code</Text>
          </View>
          
          {houseOnboarding.hasPermission === null ? (
            <Text style={styles.scannerText}>Requesting camera permission...</Text>
          ) : houseOnboarding.hasPermission === false ? (
            <Text style={styles.scannerText}>No access to camera</Text>
          ) : (
            <Camera
              style={styles.scanner}
              type={Camera.Constants.Type.back}
              barCodeScannerSettings={{
                barCodeTypes: ['qr'],
              }}
              onBarCodeScanned={houseOnboarding.handleBarCodeScanned}
            />
          )}
          
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerTarget} />
          </View>
          
          <Text style={styles.scannerHelp}>
            Position the QR code within the square
          </Text>
        </SafeAreaView>
      </Modal>
    </>
  );

  // Render the create house screen
  const renderCreateScreen = () => (
    <ScrollView>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => setActiveScreen('select')}
      >
        <Icon name="arrow-left" size={24} color="#4B5563" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Create a House</Text>
      <Text style={styles.subtitle}>Set up a new household for roommates</Text>
      
      <View style={styles.formSection}>
        <View style={styles.inputContainer}>
          <Icon name="home" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="House Name (e.g., The Alpine House)"
            value={houseOnboarding.houseName}
            onChangeText={houseOnboarding.setHouseName}
            editable={!houseOnboarding.loading}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Icon name="map-pin" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="Full Address"
            value={houseOnboarding.address}
            onChangeText={houseOnboarding.setAddress}
            multiline
            editable={!houseOnboarding.loading}
          />
        </View>
        
        <Text style={styles.verificationTitle}>House Details</Text>
        
        {/* Verification section commented out for now
        <Text style={styles.verificationText}>
          To prevent misuse, please take a photo of your house or a utility bill showing your address
        </Text>
        
        <TouchableOpacity 
          style={styles.photoButton}
          onPress={houseOnboarding.takeVerificationPhoto}
          disabled={houseOnboarding.loading}
        >
          <Icon name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.photoButtonText}>
            {houseOnboarding.verificationImage ? 'Retake Verification Photo' : 'Take Verification Photo'}
          </Text>
        </TouchableOpacity>
        
        {houseOnboarding.verificationImage && (
          <View style={styles.imagePreviewContainer}>
            <Text style={styles.previewText}>Verification image added ✓</Text>
          </View>
        )}
        */}
      </View>
      
      <TouchableOpacity 
        style={[styles.actionButton, houseOnboarding.loading && styles.buttonDisabled]}
        onPress={houseOnboarding.createHouse}
        disabled={houseOnboarding.loading}
      >
        <Text style={styles.actionButtonText}>
          {houseOnboarding.loading ? 'Creating House...' : 'Create House'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Icon name="info" size={20} color="#6B7280" />
        <Text style={styles.infoText}>
          After creating your house, you'll get a QR code that roommates can scan to join.
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Main Content - Show the appropriate screen */}
          {activeScreen === 'select' && renderSelectionScreen()}
          {activeScreen === 'join' && renderJoinScreen()}
          {activeScreen === 'create' && renderCreateScreen()}
          
          {/* Loading Indicator */}
          {houseOnboarding.loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          )}
          
          {/* QR Code Modal */}
          <Modal visible={houseOnboarding.qrVisible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
              <View style={styles.qrModalContent}>
                <Text style={styles.qrTitle}>House Created!</Text>
                <Text style={styles.qrSubtitle}>Share this QR code with roommates to join</Text>
                
                <View style={styles.qrContainer}>
                  {houseOnboarding.createdHouseId && (
                    <QrCodeSvg
                      value={houseOnboarding.createdHouseId}
                      frameSize={200}
                      dotColor="#000000"
                      backgroundColor="#FFFFFF"
                      gradientColors={['#2563EB', '#4F46E5']}
                      contentCells={5}
                      content={<Icon name="home" size={24} color="#FFFFFF" />}
                      contentStyle={styles.qrContent}
                    />
                  )}
                </View>
                
                <Text style={styles.qrIdText}>House ID: {houseOnboarding.createdHouseId}</Text>
                
                <View style={styles.qrButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.qrShareButton}
                    onPress={houseOnboarding.shareHouseQRCode}
                  >
                    <Icon name="share-2" size={20} color="#FFFFFF" />
                    <Text style={styles.qrShareButtonText}>Share</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.qrDoneButton}
                    onPress={houseOnboarding.completeOnboarding}
                  >
                    <Text style={styles.qrDoneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 20,
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4B5563',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  formSection: {
    marginBottom: 24,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 8,
  },
  verificationText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4B5563',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  previewText: {
    color: '#059669',
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  qrModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  qrIdText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 24,
  },
  qrButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  qrShareButton: {
    flexDirection: 'row',
    backgroundColor: '#4B5563',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flex: 1,
  },
  qrShareButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  qrDoneButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    flex: 1,
  },
  qrDoneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: {
    padding: 8,
  },
  scannerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 40,
  },
  scanner: {
    flex: 1,
  },
  qrContent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.8)',
    borderRadius: 8,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTarget: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
  },
  scannerText: {
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 32,
  },
  scannerHelp: {
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});

export default OrientationScreen;