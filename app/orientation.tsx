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
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/app/context/auth';


const OrientationScreen = () => {
  const { joinHouse } = useAuth();

  const [address, setAddress] = useState(__DEV__ ? '123 Main St' : '');
  const [identifier, setIdentifier] = useState(__DEV__ ? 'test@example.com' : '');
  const [loading, setLoading] = useState(false);

  const handleJoinHouse = async () => {
    try {
      if (!address.trim() || !identifier.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      setLoading(true);
      console.log('Join house attempt:', { address, identifier });

      if (__DEV__) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // joinHouse();// Set joined house state
        // router.replace('/(tabs)')
      }
      
        Alert.alert(
          'Request Sent',
          'Your request has been sent to the house members. You\'ll be notified once approved.',
          [{ 
            text: "OK",
            onPress: () => {
              joinHouse();// Set joined house state
              router.replace('/(tabs)')
            }
          }]
        );
      
      
    

    } catch (error) {
      console.error('Join house error:', error);
      Alert.alert('Error', 'Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      
    >
      <View style={styles.header}>
        <Text style={styles.title}>Join a House</Text>
        <Text style={styles.subtitle}>
          Enter the house address and your identifier to join your roommates
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Icon name="home" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="House Address"
            value={address}
            onChangeText={setAddress}
            multiline
            editable={!loading}
            testID="orientation-address-input"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="Email/Phone/Username"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            editable={!loading}
            testID="orientation-identifier-input"
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleJoinHouse}
          disabled={loading}
          testID="join-house-button"
        >
          <Text style={styles.buttonText}>
            {loading ? 'Sending Request...' : 'Send Join Request'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Icon name="info" size={20} color="#6B7280" />
        <Text style={styles.infoText}>
          Your request will be sent to current house members. Once approved, 
          you'll get full access to the house features.
        </Text>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    marginBottom: 32,
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
    lineHeight: 24,
  },
  form: {
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
  infoContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginTop: 32,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default OrientationScreen;