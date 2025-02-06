import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ReportIssueUI() {
  const [issueDescription, setIssueDescription] = useState('');
  const [issueType, setIssueType] = useState('Bug');
  const [selectedImages, setSelectedImages] = useState<{ uri: string | undefined }[]>([]);
  const pickerRef = useRef<Picker<string> | null>(null);

  const handleAttachImage = () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode, response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const newImages = response.assets.map(asset => ({ uri: asset.uri }));
        setSelectedImages([...selectedImages, ...newImages]);
      }
    });
  };

  const handleRemoveImage = (index: number): void => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };

  const handleSubmit = () => {
    // Add logic to handle issue submission
    console.log('Submit Issue', { issueDescription, issueType, selectedImages });
  };

  const pickerOptions = [
    { label: 'Billing', value: 'Billing Issue' },
    { label: 'Feature Request', value: 'Feature Request' },
    { label: 'Feedback', value: 'Feedback' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Report Issue</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Issue Type</Text>
        <Picker
          ref={pickerRef}
          selectedValue={issueType}
          style={styles.picker}
          onValueChange={(itemValue) => setIssueType(itemValue)}
        >
          {pickerOptions.map((option, index) => (
            <Picker.Item key={index} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.otherContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Describe your issue here..."
            placeholderTextColor="#888"
            multiline
            value={issueDescription}
            onChangeText={setIssueDescription}
          />
          <View style={styles.imageRow}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={image} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(index)}>
                  <FontAwesome name="times-circle" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageButton} onPress={handleAttachImage}>
              <FontAwesome name="plus" size={24} color="#888" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 100, // Increased margin to add more space
    padding: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    alignSelf: 'flex-start', // Move label to the left
  },
  picker: {
    height: 50,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  separator: {
    height: 32,
  },
  otherContainer: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 2,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});