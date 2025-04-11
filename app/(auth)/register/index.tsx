// app/(auth)/register/index.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';

const RegisterScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/login')}
          >
            <Icon name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
        </View>
        
        <View style={styles.welcomeContainer}>
          <Icon name="home" size={64} color="#2563EB" />
          <Text style={styles.welcomeTitle}>Join Our Community</Text>
          <Text style={styles.welcomeText}>
            Create your account to find your perfect living arrangement and build your roommate reputation.
          </Text>
        </View>
        
        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View style={styles.stepIcon}>
              <Icon name="user" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Personal Information</Text>
              <Text style={styles.stepDescription}>Your basic profile details</Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={styles.stepIcon}>
              <Icon name="mail" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Contact Details</Text>
              <Text style={styles.stepDescription}>Email and verification</Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={styles.stepIcon}>
              <Icon name="file-text" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Bio & Interests</Text>
              <Text style={styles.stepDescription}>Tell us about yourself</Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={styles.stepIcon}>
              <Icon name="lock" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Secure Your Account</Text>
              <Text style={styles.stepDescription}>Create a password</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/register/step1')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Icon name="arrow-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepsContainer: {
    marginBottom: 40,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  button: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default RegisterScreen;