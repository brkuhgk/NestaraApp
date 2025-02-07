// app/(auth)/register.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: __DEV__ ? 'John Doe' : '',
    email: __DEV__ ? 'test@example.com' : '',
    phone: __DEV__ ? '1234567890' : '',
    bio: __DEV__ ? 'Friendly roommate' : '',
    password: __DEV__ ? 'password123' : '',
    confirmPassword: __DEV__ ? 'password123' : '',
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    try {
      if (!validateForm()) return;
      
      setLoading(true);
      console.log('Registration attempt:', formData);

      // Simulate API delay in development
      if (__DEV__) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // TODO: Add your registration API call here

      // Success - Navigate to orientation
      router.replace('/orientation');
      
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our community of roommates</Text>
        </View>

        <View style={styles.form}>
          {[
            { key: 'name', icon: 'user', placeholder: 'Full Name', required: true },
            { key: 'email', icon: 'mail', placeholder: 'Email', required: true, keyboardType: 'email-address' },
            { key: 'phone', icon: 'phone', placeholder: 'Phone', required: true, keyboardType: 'phone-pad' },
            { key: 'bio', icon: 'file-text', placeholder: 'Bio (Optional)', multiline: true },
            { key: 'password', icon: 'lock', placeholder: 'Password', secure: true, required: true },
            { key: 'confirmPassword', icon: 'lock', placeholder: 'Confirm Password', secure: true, required: true },
          ].map((field) => (
            <View key={field.key} style={styles.inputContainer}>
              <Icon name={field.icon} size={20} color="#9CA3AF" />
              <TextInput
                style={[styles.input, field.multiline && styles.multilineInput]}
                placeholder={field.placeholder + (field.required ? ' *' : '')}
                value={formData[field.key]}
                onChangeText={(text) => updateFormData(field.key, text)}
                secureTextEntry={field.secure}
                multiline={field.multiline}
                keyboardType={field.keyboardType || 'default'}
                autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                editable={!loading}
                testID={`register-${field.key}-input`}
              />
            </View>
          ))}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            testID="register-button"
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/login')}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    padding: 24,
    gap: 16,
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
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    padding: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
});

export default RegisterScreen;