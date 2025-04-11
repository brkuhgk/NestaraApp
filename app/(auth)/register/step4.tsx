// app/(auth)/register/step4.tsx
import React, { useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/api/auth.service';

const RegisterStep4 = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation states
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    
    setConfirmPasswordError('');
    return true;
  };

  const updatePasswordStrength = (text) => {
    setPasswordStrength({
      length: text.length >= 8,
      uppercase: /[A-Z]/.test(text),
      lowercase: /[a-z]/.test(text),
      number: /[0-9]/.test(text),
      special: /[^A-Za-z0-9]/.test(text),
    });
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    updatePasswordStrength(text);
    if (passwordError) validatePassword();
    if (confirmPasswordError && confirmPassword) validateConfirmPassword();
  };

  const calculatePasswordStrengthPercentage = () => {
    const { length, uppercase, lowercase, number, special } = passwordStrength;
    const totalChecks = 5;
    const passedChecks = [length, uppercase, lowercase, number, special].filter(Boolean).length;
    return (passedChecks / totalChecks) * 100;
  };

    
//     if (!isPasswordValid || !isConfirmPasswordValid) {
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       // Get all registration data
//       const registerDataStr = await AsyncStorage.getItem('registerData');
//       if (!registerDataStr) {
//         throw new Error('Registration data not found. Please start over.');
//       }
      
//       const registerData = JSON.parse(registerDataStr);
      
//       // Prepare registration payload
//       const payload = {
//         email: registerData.email.toLowerCase(),
//         password: password,
//         name: `${registerData.firstName} ${registerData.lastName}`,
//         phone: registerData.phone || '',
//         username: registerData.username,
//         type: 'norole', // Default role
//         bio: registerData.bio || ''
//       };
      
//       console.log('Registering with payload:', payload);
      
//       // Call registration API
//       const response = await authService.register(payload);
//       console.log('Registration response:', response);
      
//       // Clear registration data from AsyncStorage
//       await AsyncStorage.removeItem('registerData');
      
//       // Show success message
//       Alert.alert(
//         'Account Created!',
//         'Your account has been successfully created.',
//         [{ text: 'Continue', onPress: () => router.replace('/orientation') }]
//       );
      
//     } catch (error) {
//       console.error('Registration error:', error);
//       Alert.alert(
//         'Registration Failed',
//         error.message || 'Failed to create your account. Please try again.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

const handleCreateAccount = async () => {
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    
    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get all registration data
      const registerDataStr = await AsyncStorage.getItem('registerData');
      if (!registerDataStr) {
        throw new Error('Registration data not found. Please start over.');
      }
      
      const registerData = JSON.parse(registerDataStr);
      
      // Prepare registration payload according to your API expectations
      const payload = {
        email: registerData.email.toLowerCase(),
        password: password,
        name: `${registerData.firstName} ${registerData.lastName}`,
        phone: registerData.phone || '0000000000', // Provide a default if not collected
        username: registerData.email.split('@')[0],// use email prefix as username
        type: 'norole', // Default role as specified in your existing code
        bio: registerData.bio || ''
      };
      
      console.log('Registration attempt:', payload);
      
      // Call registration API using your existing authService
      const response = await authService.register(payload);
      console.log('Registration response:', response);
      
      // Clear registration data from AsyncStorage
      await AsyncStorage.removeItem('registerData');
      
      // Store token and user data if available in the response
      if (response.token) {
        await AsyncStorage.setItem('auth_token', response.token);
        if (response.refreshToken) {
          await AsyncStorage.setItem('refresh_token', response.refreshToken);
        }
        
        // Update auth store if you're using it
        // setToken(response.token);
        // setUser(response.user);
      }
      
      // Show success message and navigate to appropriate screen
      Alert.alert(
        'Account Created!',
        'Your account has been successfully created.',
        [{ 
          text: 'Continue', 
          onPress: () => router.replace('/orientation')
        }]
      );
      
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.message || 'Failed to create your account. Please try again.'
      );
    } finally {
      setIsLoading(false);
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
            <Text style={styles.title}>Create Password</Text>
          </View>
          
          <ProgressBar currentStep={4} totalSteps={4} />
          
          <Text style={styles.sectionTitle}>Secure your account</Text>
          <Text style={styles.sectionDescription}>
            Create a strong password to protect your account. Your password should include a mix of letters, numbers, and special characters.
          </Text>
          
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password *</Text>
              <View style={[styles.inputContainer, passwordError && styles.inputError]}>
                <Icon name="lock" size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  onBlur={validatePassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon name={showPassword ? 'eye' : 'eye-off'} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              
              {/* Password strength indicator */}
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarContainer}>
                  <View 
                    style={[
                      styles.strengthBar, 
                      { 
                        width: `${calculatePasswordStrengthPercentage()}%`,
                        backgroundColor: calculatePasswordStrengthPercentage() < 40 ? '#EF4444' :
                                        calculatePasswordStrengthPercentage() < 70 ? '#F59E0B' : '#10B981'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.strengthText}>
                  {calculatePasswordStrengthPercentage() < 40 ? 'Weak' :
                   calculatePasswordStrengthPercentage() < 70 ? 'Fair' : 'Strong'}
                </Text>
              </View>
              
              {/* Password requirements */}
              <View style={styles.requirementsContainer}>
                <View style={styles.requirementItem}>
                  <Icon 
                    name={passwordStrength.length ? 'check-circle' : 'circle'} 
                    size={16} 
                    color={passwordStrength.length ? '#10B981' : '#D1D5DB'}
                  />
                  <Text style={[
                    styles.requirementText, 
                    passwordStrength.length && styles.requirementMet
                  ]}>
                    At least 8 characters
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Icon 
                    name={passwordStrength.uppercase ? 'check-circle' : 'circle'} 
                    size={16} 
                    color={passwordStrength.uppercase ? '#10B981' : '#D1D5DB'}
                  />
                  <Text style={[
                    styles.requirementText, 
                    passwordStrength.uppercase && styles.requirementMet
                  ]}>
                    At least 1 uppercase letter
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Icon 
                    name={passwordStrength.lowercase ? 'check-circle' : 'circle'} 
                    size={16} 
                    color={passwordStrength.lowercase ? '#10B981' : '#D1D5DB'}
                  />
                  <Text style={[
                    styles.requirementText, 
                    passwordStrength.lowercase && styles.requirementMet
                  ]}>
                    At least 1 lowercase letter
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Icon 
                    name={passwordStrength.number ? 'check-circle' : 'circle'} 
                    size={16} 
                    color={passwordStrength.number ? '#10B981' : '#D1D5DB'}
                  />
                  <Text style={[
                    styles.requirementText, 
                    passwordStrength.number && styles.requirementMet
                  ]}>
                    At least 1 number
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Icon 
                    name={passwordStrength.special ? 'check-circle' : 'circle'} 
                    size={16} 
                    color={passwordStrength.special ? '#10B981' : '#D1D5DB'}
                  />
                  <Text style={[
                    styles.requirementText, 
                    passwordStrength.special && styles.requirementMet
                  ]}>
                    At least 1 special character
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={[styles.inputContainer, confirmPasswordError && styles.inputError]}>
                <Icon name="lock" size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) validateConfirmPassword();
                  }}
                  secureTextEntry={!showConfirmPassword}
                  onBlur={validateConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleCreateAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Create Account</Text>
                <Icon name="check" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
          <View style={styles.stepsIndicator}>
            <Text style={styles.stepsText}>Step 4 of 4</Text>
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
    marginBottom: 24,
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
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  strengthBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 4,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 50,
  },
  requirementsContainer: {
    marginTop: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  requirementMet: {
    color: '#10B981',
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
  buttonDisabled: {
    backgroundColor: '#93C5FD',
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

export default RegisterStep4;