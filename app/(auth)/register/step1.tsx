// app/(auth)/register/step1.tsx
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/api/auth.service';

// Debounce function for username check
const debounce = (func, delay) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const RegisterStep1 = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Validation states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dobError, setDobError] = useState('');

 

  // Load saved data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadSavedData = async () => {
        try {
          const savedData = await AsyncStorage.getItem('registerData');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFirstName(parsedData.firstName || '');
            setLastName(parsedData.lastName || '');
            setPhone(parsedData.phone || '');
            setDob(parsedData.dob ? new Date(parsedData.dob) : null);
            
          }
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      };
      
      loadSavedData();
    }, [])
  );



  const validateFirstName = () => {
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      return false;
    }
    setFirstNameError('');
    return true;
  };

  const validateLastName = () => {
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      return false;
    }
    setLastNameError('');
    return true;
  };

  

  const validatePhone = () => {
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      return false;
    }
    
    // Clean the phone number to just digits for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const validateDob = () => {
    if (!dob) {
      setDobError('Date of birth is required');
      return false;
    }
    // Age verification (must be at least 18 years old)
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    
    if (dob > eighteenYearsAgo) {
      setDobError('You must be at least 18 years old');
      return false;
    }
    
    setDobError('');
    return true;
  };



  const handleContinue = async () => {
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isPhoneValid = validatePhone();
    const isDobValid = validateDob();
    
    if (isFirstNameValid && isLastNameValid  && isPhoneValid && isDobValid) {
      try {
        // Load existing registration data if any
        const existingDataStr = await AsyncStorage.getItem('registerData');
        const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
        
        // Clean phone number to just digits for API
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Update with new data
        const updatedData = {
          ...existingData,
          firstName,
          lastName,
          phone: cleanPhone,
          dob: dob?.toISOString(),
          name: `${firstName} ${lastName}` // For API compatibility
        };
        
        await AsyncStorage.setItem('registerData', JSON.stringify(updatedData));
        router.push('/register/step2');
      } catch (error) {
        console.error('Error saving data:', error);
        Alert.alert('Error', 'Failed to save your information. Please try again.');
      }
    }
  };

  const formatDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
      setDobError('');
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
            <Text style={styles.title}>Personal Info</Text>
          </View>
          
          <ProgressBar currentStep={1} totalSteps={4} />
          
          <Text style={styles.sectionTitle}>Tell us about you</Text>
          <Text style={styles.sectionDescription}>
            This information helps us create your profile and connect you with roommates.
          </Text>
          
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>First Name *</Text>
              <View style={[styles.inputContainer, firstNameError && styles.inputError]}>
                <Icon name="user" size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your first name"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (firstNameError) validateFirstName();
                  }}
                  onBlur={validateFirstName}
                />
              </View>
              {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Last Name *</Text>
              <View style={[styles.inputContainer, lastNameError && styles.inputError]}>
                <Icon name="user" size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your last name"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (lastNameError) validateLastName();
                  }}
                  onBlur={validateLastName}
                />
              </View>
              {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <View style={[styles.inputContainer, phoneError && styles.inputError]}>
                <Icon name="phone" size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={(text) => {
                    // Only allow numeric input and format nicely
                    const numericInput = text.replace(/\D/g, '');
                    if (numericInput.length <= 10) {
                      // Format as (XXX) XXX-XXXX for US numbers
                      let formattedNumber = numericInput;
                      if (numericInput.length >= 4 && numericInput.length <= 6) {
                        formattedNumber = `(${numericInput.slice(0, 3)}) ${numericInput.slice(3)}`;
                      } else if (numericInput.length > 6) {
                        formattedNumber = `(${numericInput.slice(0, 3)}) ${numericInput.slice(3, 6)}-${numericInput.slice(6)}`;
                      } else if (numericInput.length > 3) {
                        formattedNumber = `(${numericInput.slice(0, 3)}) ${numericInput.slice(3)}`;
                      }
                      
                      setPhone(formattedNumber);
                    }
                    
                    if (phoneError) validatePhone();
                  }}
                  onBlur={validatePhone}
                  keyboardType="phone-pad"
                  maxLength={14} // (XXX) XXX-XXXX format
                />
              </View>
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date of Birth *</Text>
              <TouchableOpacity
                style={[styles.inputContainer, dobError && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
              >
                <Icon name="calendar" size={20} color="#9CA3AF" />
                <Text style={[styles.input, !dob && styles.placeholderText]}>
                  {dob ? formatDate(dob) : 'Select your date of birth'}
                </Text>
              </TouchableOpacity>
              {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dob || new Date(2000, 0, 1)}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.stepsIndicator}>
            <Text style={styles.stepsText}>Step 1 of 4</Text>
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
    marginBottom: 16,
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
  placeholderText: {
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  successText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
    marginLeft: 4,
  },
  iconRight: {
    marginLeft: 8,
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

export default RegisterStep1;