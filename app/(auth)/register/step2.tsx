// app/(auth)/register/step2.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';
import ProgressBar from '@/components/ui/ProgressBar';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/api/auth.service';

const RegisterStep2 = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [verificationError, setVerificationError] = useState('');

  // Load saved data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadSavedData = async () => {
        try {
          const savedData = await AsyncStorage.getItem('registerData');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setEmail(parsedData.email || '');
            setIsVerified(parsedData.isEmailVerified || false);
          }
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      };
      
      loadSavedData();
    }, [])
  );

  // Handle countdown for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateVerificationCode = () => {
    if (!verificationCode.trim()) {
      setVerificationError('Verification code is required');
      return false;
    }
    if (verificationCode.length !== 6) {
      setVerificationError('Verification code must be 6 digits');
      return false;
    }
    setVerificationError('');
    return true;
  };

  const handleSendCode = async () => {
    if (!validateEmail()) return;
    
    setIsSendingCode(true);
    
    try {
      // Call your backend API
      const response = await authService.sendVerificationCode(email);
      
      setIsVerifying(true);
      setCountdown(60); // Start countdown from 60 seconds
      
      Alert.alert(
        'Code Sent',
        `A verification code has been sent to ${email}. Check your inbox (including spam folder).`
      );
    } catch (error) {
      console.error('Error sending verification code:', error);
      let errorMsg = 'Failed to send verification code. Please try again.';
      
      if (error.message) {
        errorMsg = error.message;
      }
      
      Alert.alert('Error', errorMsg);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateVerificationCode()) return;
    
    try {
      // Verify the code through your backend
      const response = await authService.verifyCode(email, verificationCode);
      console.log('Verification response:', response);
      if (response.verified) {
        setIsVerified(true);
        setVerificationError('');
        Alert.alert('Success', 'Email verified successfully!');
      } else {
        setVerificationError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      let errorMsg = 'Invalid verification code. Please try again.';
      
      if (error.message) {
        errorMsg = error.message;
      }
      
      setVerificationError(errorMsg);
    }
  };

  const handleContinue = async () => {
    if (!isVerified) {
      Alert.alert('Verification Required', 'Please verify your email before continuing.');
      return;
    }
    
    try {
      // Load existing registration data
      const existingDataStr = await AsyncStorage.getItem('registerData');
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
      
      // Update with new data
      const updatedData = {
        ...existingData,
        email,
        isEmailVerified: true
      };
      
      await AsyncStorage.setItem('registerData', JSON.stringify(updatedData));
      router.push('/register/step3');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Icon name="arrow-left" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.title}>Email Verification</Text>
          </View>
          
          <ProgressBar currentStep={2} totalSteps={4} />
          
          <Text style={styles.sectionTitle}>Verify your email</Text>
          <Text style={styles.sectionDescription}>
            We'll send a verification code to ensure your email is valid. This helps secure your account.
          </Text>
          
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <View style={[styles.inputContainer, emailError && styles.inputError]}>
                <Icon name="mail" size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail();
                    // Reset verification if email changes
                    if (isVerified) {
                      setIsVerified(false);
                      setIsVerifying(false);
                    }
                  }}
                  onBlur={validateEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isVerified} // Disable editing if verified
                />
                {isVerified && (
                  <Icon name="check-circle" size={20} color="#10B981" style={styles.verifiedIcon} />
                )}
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              
              {!isVerified && (
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    (isSendingCode || countdown > 0) && styles.disabledButton
                  ]}
                  onPress={handleSendCode}
                  disabled={isSendingCode || countdown > 0}
                >
                  {isSendingCode ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.sendButtonText}>
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Send Verification Code'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
            
            {isVerifying && !isVerified && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Verification Code *</Text>
                <View style={[styles.inputContainer, verificationError && styles.inputError]}>
                  <Icon name="key" size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChangeText={(text) => {
                      // Only allow digits
                      const digits = text.replace(/[^0-9]/g, '');
                      setVerificationCode(digits);
                      if (verificationError) validateVerificationCode();
                    }}
                    maxLength={6}
                    keyboardType="number-pad"
                  />
                </View>
                {verificationError ? <Text style={styles.errorText}>{verificationError}</Text> : null}
                
                <TouchableOpacity
                  style={[styles.verifyButton, !verificationCode && styles.disabledButton]}
                  onPress={handleVerifyCode}
                  disabled={!verificationCode}
                >
                  <Text style={styles.verifyButtonText}>Verify Code</Text>
                </TouchableOpacity>
                
                <Text style={styles.verifyNote}>
                  For this demo, use "123456" as the verification code.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !isVerified && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!isVerified}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.stepsIndicator}>
            <Text style={styles.stepsText}>Step 2 of 4</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  sendButton: {
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
    opacity: 0.8,
  },
  verifyButton: {
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  verifyNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  stepsIndicator: {
    alignItems: 'center',
  },
  stepsText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default RegisterStep2;