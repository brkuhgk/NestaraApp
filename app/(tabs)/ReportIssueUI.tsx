import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  PermissionsAndroid, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
const ReportScreen = () => {
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [image, setImage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);



  const categories = [
    { id: 'cleanliness', label: 'Cleanliness' },
    { id: 'behavior', label: 'Behavior & Cooperation' },
    { id: 'payment', label: 'Payment History' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'communication', label: 'Communication' },
  ];

  const types = [
    { id: 'conflict', label: 'Conflict', color: '#DC2626' },
    { id: 'mentions', label: 'Mentions', color: '#059669' },
    { id: 'general', label: 'General', color: '#2563EB' },
  ];
const handleSubmit = () => {
    if (!selectedType) {
      Alert.alert('Error', 'Please select a report type');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!selectedUser && !isAnonymous) {
      Alert.alert('Error', 'Please select a user or choose to remain anonymous');
      return;
    }

    console.log({
      type: selectedType,
      category: selectedCategory,
      description,
      image,
      reportedUser: selectedUser,
      isAnonymous
    });
  };

// In your handleImagePick function
const handleImagePick = () => {
  const options = {
    mediaType: 'photo',
    maxWidth: 300,
    maxHeight: 300,
    quality: 1,
  };

  Alert.alert(
    'Select Photo',
    'Choose an option',
    [
      {
        text: 'Take Photo',
        onPress: () => {
          launchCamera(options, response => {
            if (!response.didCancel && !response.error) {
              setImage(response.assets[0].uri);
            }
          });
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: () => {
          launchImageLibrary(options, response => {
            if (!response.didCancel && !response.error) {
              setImage(response.assets[0].uri);
            }
          });
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
  );
};






  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Report</Text>
        </View>

        {/* Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Type</Text>
          <View style={styles.typeContainer}>
            {types.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  selectedType === type.id && { backgroundColor: type.color }
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <Text style={[
                  styles.typeText,
                  selectedType === type.id && styles.selectedTypeText
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            placeholder="Describe the issue..."
            value={description}
            onChangeText={setDescription}
          />
        </View>
        
       

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Photo</Text>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.uploadedImage} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => setImage(null)}
              >
                <Icon name="x" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleImagePick}
            >
              <Icon name="camera" size={24} color="#6B7280" />
              <Text style={styles.uploadText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>Submit Report</Text>
      </TouchableOpacity>
    

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20, // Adjusted to move the button up
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  typeText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  selectedTypeText: {
    color: '#FFF',
  },
  categoryContainer: {
    paddingVertical: 8,
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    color: '#4B5563',
  },
  selectedCategoryText: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    height: 120,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#6B7280',
    marginTop: 8,
  },
  imageContainer: {
    width: 150,
    height: 150,
    marginVertical: 10,

    position: 'relative',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 4,
  },
  
  submitButton: {
    left: 0,
    right: 0,
    position: 'relative',
    backgroundColor: '#2563EB',
    padding: 16,
    alignItems: 'center',
    marginBottom: 70, // Adjusted to move the button up
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ReportScreen;