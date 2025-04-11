// app/(auth)/register/step3.tsx
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
} from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';
import ProgressBar from '@/components/ui/ProgressBar';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterStep3 = () => {
  const [bio, setBio] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 500;
  
  // Load saved data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const loadSavedData = async () => {
        try {
          const savedData = await AsyncStorage.getItem('registerData');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            const savedBio = parsedData.bio || '';
            setBio(savedBio);
            setCharCount(savedBio.length);
          }
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      };
      
      loadSavedData();
    }, [])
  );

  const handleBioChange = (text) => {
    if (text.length <= maxCharCount) {
      setBio(text);
      setCharCount(text.length);
    }
  };

  const handleContinue = async () => {
    try {
      // Load existing registration data
      const existingDataStr = await AsyncStorage.getItem('registerData');
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
      
      // Update with new data
      const updatedData = {
        ...existingData,
        bio
      };
      
      await AsyncStorage.setItem('registerData', JSON.stringify(updatedData));
      router.push('/register/step4');
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
            <Text style={styles.title}>About You</Text>
          </View>
          
          <ProgressBar currentStep={3} totalSteps={4} />
          
          <Text style={styles.sectionTitle}>Tell us about yourself</Text>
          <Text style={styles.sectionDescription}>
            Share details about your lifestyle, interests, and preferences as a roommate. This helps others get to know you better.
          </Text>
          
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Bio</Text>
              <View style={styles.bioInputContainer}>
                <TextInput
                  style={styles.bioInput}
                  placeholder="Tell us about yourself, your lifestyle, interests, and what makes you a great roommate..."
                  value={bio}
                  onChangeText={handleBioChange}
                  multiline
                  textAlignVertical="top"
                />
              </View>
              <View style={styles.charCountContainer}>
                <Text style={[
                  styles.charCount,
                  charCount > maxCharCount * 0.8 && styles.charCountWarning
                ]}>
                  {charCount} / {maxCharCount}
                </Text>
              </View>
            </View>
            
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Tips for a great bio:</Text>
              <View style={styles.tipItem}>
                <Icon name="check" size={16} color="#10B981" style={styles.tipIcon} />
                <Text style={styles.tipText}>Mention your daily schedule and habits</Text>
              </View>
              <View style={styles.tipItem}>
                <Icon name="check" size={16} color="#10B981" style={styles.tipIcon} />
                <Text style={styles.tipText}>Share your cleaning preferences</Text>
              </View>
              <View style={styles.tipItem}>
                <Icon name="check" size={16} color="#10B981" style={styles.tipIcon} />
                <Text style={styles.tipText}>Describe your ideal living environment</Text>
              </View>
              <View style={styles.tipItem}>
                <Icon name="check" size={16} color="#10B981" style={styles.tipIcon} />
                <Text style={styles.tipText}>Include hobbies and interests</Text>
              </View>
            </View>
          </View>
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
            <Text style={styles.stepsText}>Step 3 of 4</Text>
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
  bioInputContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  bioInput: {
    height: 200,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  charCountContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  charCountWarning: {
    color: '#F59E0B',
  },
  tipsContainer: {
    marginTop: 24,
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#065F46',
    flex: 1,
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

export default RegisterStep3;