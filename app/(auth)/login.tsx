// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/app/context/auth';
import { useAuthStore } from '@/store/useAuthStore';

import api from '@/services/api/client';
import { authService } from '@/services/api/auth.service';

const LoginScreen = () => {

  const { setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState(__DEV__ ? 'test102@example.com' : '');
  const [password, setPassword] = useState(__DEV__ ? 'test1234' : '');


  const handleLogin = async () => {
    try {
      setLoading(true);

      // Validation
      if (!identifier || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Make the login request
      const response = await authService.login({
        email: identifier.toLowerCase(), // ensure email is lowercase
        password
      });
      
      // Store token
      const token = response.token;
      console.log('login is clicked Stored Token:', token);
      await AsyncStorage.setItem('auth_token', response.token);
      await AsyncStorage.setItem('refresh_token', response.refreshToken);

      // Update store
      setToken(response.token);
      setUser(response.user);

      //TO-DO: Add orientation phase if user has not joined a house, navigate to house join screen
      
      // Navigate to main app
      router.replace('/(tabs)');

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Please check your credentials and try again');
    } finally{
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await api.get('/health');
      console.log('API connection test:', response.data);
      Alert.alert('Success', 'API is accessible');
    } catch (error) {
      console.error('API test error:', error);
      Alert.alert('Error', 'Cannot connect to API');
    }
  };

  const handleLoginContext = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!identifier || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // TODO: Add your login API call here
      console.log('Login attempt:', { identifier, password });
      
      // Simulate API delay in development
      if (__DEV__) { //__DEV__
        console.log('Simulating login...',__DEV__);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      login(); // Add this to set authentication state
      // Success - Navigate to main app
    router.replace('/(tabs)');
      
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} >
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to access your account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="Email/Phone/Username"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            testID="login-identifier-input"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            testID="login-password-input"
          />
        </View>

        <TouchableOpacity 
          onPress={() => router.push('../forgot-password')}
          disabled={loading}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          testID="login-button"
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => router.push('/register')}
          disabled={loading}
        >
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>
        {/* // Add a test button in your UI */}
    {/* <TouchableOpacity onPress={testConnection}>
      <Text>Test API Connection</Text>
        </TouchableOpacity> */}
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
  forgotPassword: {
    color: '#2563EB',
    textAlign: 'right',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    alignItems: 'center',
    padding: 16,
  },
  registerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  registerLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
});

export default LoginScreen;