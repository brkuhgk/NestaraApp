import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '@/store/useAuthStore';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useImageUrl } from '@/hooks/useImageUrl';
import { userService } from '@/services/api/user.service';
import imageService from '@/services/api/image.service';
import { useHouseStore } from '@/store/useHouseStore';
import { useQueryClient } from '@tanstack/react-query';


const EditProfileScreen = () => {
  const { user, setUser } = useAuthStore();
  const { setCurrentHouse, currentHouse } = useHouseStore();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Image handling hooks
  const { 
    pickFromGallery, 
    captureFromCamera, 
    isUploading, 
    imageKey 
  } = useImageUpload();
  
  const { 
    url: currentImageUrl, 
    isLoading: isImageLoading
  } = useImageUrl(user?.image_key);
  
  // Track if we have a new image to upload
  const [newImageKey, setNewImageKey] = useState<string | null>(null);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const handleImagePick = async () => {
    // Show action sheet with options
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await captureFromCamera('profile-images');
            if (result) {
              setNewImageKey(result.imageKey);
              setLocalImageUri(result.uri);
            }
          }
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const result = await pickFromGallery('profile-images');
            if (result) {
              setNewImageKey(result.imageKey);
              setLocalImageUri(result.uri);
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Prepare update data
      const updateData = {
        name: form.name,
        bio: form.bio,
      };
      
      if (newImageKey) {
        updateData.image_key = newImageKey;
      }
      
      // Update profile
      const updatedUser = await userService.updateProfile(updateData);
      
      // Update user in auth store
      setUser({
        ...user,
        ...updateData,
        image_url: updatedUser.image_url
      });

      // Invalidate house query to trigger refresh
      if (currentHouse) {
        queryClient.invalidateQueries(['house', currentHouse.id]);
      }
      
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
      
    } catch (error) {
      console.error('[EditProfile] Error updating profile:', error);
      // More detailed error message
      const errorMsg = error.message || 
                      (error.response?.data?.error) || 
                      'Network error, please check your connection';
      Alert.alert('Error', errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <Text style={styles.saveButton}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageSection}>
          {isImageLoading || isUploading ? (
            <ActivityIndicator 
              size="large" 
              color="#2563EB" 
              style={styles.profileImage} 
            />
          ) : (
            <Image
              source={{ 
                uri: localImageUri || currentImageUrl || 'https://placehold.jp/3d4070/ffffff/150x150.png' 
              }}
              style={styles.profileImage}
            />
          )}
          <TouchableOpacity 
            style={styles.changePhotoButton}
            onPress={handleImagePick}
            disabled={isUploading}
          >
            <Text style={styles.changePhotoText}>
              {isUploading ? 'Uploading...' : 'Change Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({...form, name: text})}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={form.email}
              editable={false}
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={form.phone}
              editable={false}
            />
            <Text style={styles.helperText}>Phone cannot be changed</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={form.bio}
              onChangeText={(text) => setForm({...form, bio: text})}
              multiline
              placeholder="Tell us about yourself"
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: '#2563EB',
    fontSize: 16,
  },
  form: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default EditProfileScreen;