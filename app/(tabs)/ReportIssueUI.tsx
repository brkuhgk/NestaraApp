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
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useHomeScreen } from '@/hooks/useHomeScreen';
import { useAuthStore } from '@/store/useAuthStore';
import { topicService } from '@/services/api/topic.service';
import { router } from 'expo-router';
import { create } from 'zustand';

const ReportScreen = () => {
  const { user } = useAuthStore();
  const { members, isLoading } = useHomeScreen();
  
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [image, setImage] = useState(null);
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Filter out current user and get only tenants
  const availableTenants = members
    ?.filter(member => member.user.id !== user?.id && member.user.type === 'tenant')
    .map(member => member.user) || [];

  const categories = [
    { id: 'rp1', label: 'Cleanliness' },
    { id: 'rp2', label: 'Behavior & Cooperation' },
    { id: 'rp3', label: 'Payment History' },
    { id: 'rp4', label: 'Maintenance' },
    { id: 'rp5', label: 'Communication' },
  ];

  const types = [
    { id: 'conflict', label: 'Conflict', color: '#DC2626' },
    { id: 'mentions', label: 'Mentions', color: '#059669' },
    { id: 'general', label: 'General', color: '#2563EB' },
  ];

  const handleSubmit = async () => {
    try{
    if (!selectedType) {
      Alert.alert('Error', 'Please select a report type');
      return;
    }
    if (!selectedCategory && selectedType !== 'general') {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (selectedType !== 'general' && selectedTenants.length === 0) {
      Alert.alert('Error', 'Please select tenants or choose anonymous submission');
      return;
    }
    // Get house_id from the first member (since all members belong to same house)
    // console.log('Members: ==============', members);
    const house_id = members?.[0]?.user.house_id;
    if (!house_id) {
      Alert.alert('Error', 'House ID not found');
      return;
    }
      // Determine created_by and created_for based on topic type
      let created_by = user?.id;  // Default to current user
      let created_for = [user?.id];  // Default to current user for general topics
  
      if (selectedType !== 'general') {
        // For conflict/mentions topics
        created_by = isAnonymous ? undefined : user?.id;
        created_for = selectedTenants;
      }

    console.log({
      type: selectedType,
      category: selectedCategory,
      house_id,
      description,
      image,
      created_by: isAnonymous? null : user?.id,
      created_for: selectedTenants,
    });

    // Prepare form data
    const formData = {
      house_id,
      type: selectedType,
      description,
      rating_parameter: selectedCategory,
      created_by: isAnonymous ? null : user?.id, // Set to null if anonymous
      created_for: selectedTenants,
      images: image ? [image] : []
    };

    console.log('Submitting form:', formData);
    
    // Call your API here
    const response = await topicService.createTopic(formData);
    
    // Show success message and navigate back
    Alert.alert(
      'Success',
      'Report submitted successfully',
      [{ text: 'OK', onPress: () => router.back() }]
    );

  } catch (error) {
    console.error('Error submitting report:', error);
    Alert.alert('Error', (error as any).message || 'Failed to submit report');
  }
  
  };

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

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
        {selectedType !== 'general' && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Select Tenants</Text>
    
    {/* Selected Tenants Chips */}
    <View style={styles.chipContainer}>
      {selectedTenants.map(tenantId => {
        const tenant = availableTenants.find(t => t.id === tenantId);
        if (!tenant) return null;
        
        return (
          <View key={tenant.id} style={styles.chip}>
            <Image
              source={
                tenant.image_url
                  ? { uri: tenant.image_url }
                  : { uri: 'https://via.placeholder.com/24' }
              }
              style={styles.chipImage}
            />
            <Text style={styles.chipText} numberOfLines={1}>
              {tenant.name}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedTenants(prev => 
                  prev.filter(id => id !== tenant.id)
                );
              }}
              style={styles.chipRemove}
            >
              <Icon name="x" size={16} color="#4B5563" />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>

    {/* Tenant Selection Dropdown/Modal Trigger */}
    <TouchableOpacity
      style={styles.selectTenantsButton}
      onPress={() => {
        // Show dropdown or modal for tenant selection
        Alert.alert(
          'Select Tenants',
          '',
          availableTenants.map(tenant => ({
            text: tenant.name,
            onPress: () => {
              setSelectedTenants(prev => {
                if (prev.includes(tenant.id)) {
                  return prev.filter(id => id !== tenant.id);
                }
                return [...prev, tenant.id];
              });
              if (isAnonymous) setIsAnonymous(false);
            },
            style: selectedTenants.includes(tenant.id) ? 'destructive' : 'default' as 'destructive' | 'default'
          })).concat([
            { text: 'Cancel', onPress: () => {}, style: 'cancel' as 'cancel' }
          ])
        );
      }}
    >
      <Icon name="users" size={20} color="#6B7280" />
      <Text style={styles.selectTenantsText}>
        {selectedTenants.length ? 'Add more tenants' : 'Select tenants'}
      </Text>
    </TouchableOpacity>

    {/* Anonymous Option */}
    <TouchableOpacity
      style={styles.anonymousButton}
      onPress={() => {
        setIsAnonymous(!isAnonymous);
        // if (!isAnonymous) setSelectedTenants([]);
      }}
    >
      <Icon
        name={isAnonymous ? "check-square" : "square"}
        size={24}
        color={isAnonymous ? "#2563EB" : "#D1D5DB"}
      />
      <Text style={[
        styles.anonymousText,
        isAnonymous && styles.anonymousTextSelected
      ]}>
        Submit Anonymously
      </Text>
    </TouchableOpacity>
  </View>
)}

        {/* Tenant Selection - Only show for conflict/mentions */}
        {/* {selectedType !== 'general' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Tenants</Text>
            <ScrollView style={styles.tenantList}>
              {availableTenants.map((tenant) => (
                <TouchableOpacity
                  key={tenant.id}
                  style={[
                    styles.tenantItem,
                    selectedTenants.includes(tenant.id) && styles.selectedTenantItem
                  ]}
                  onPress={() => {
                    setSelectedTenants(prev => {
                      if (prev.includes(tenant.id)) {
                        return prev.filter(id => id !== tenant.id);
                      }
                      return [...prev, tenant.id];
                    });
                    if (isAnonymous) setIsAnonymous(false);
                  }}
                >
                  <View style={styles.tenantInfo}>
                    <Image
                      source={
                        tenant.image_url
                          ? { uri: tenant.image_url }
                          : { uri: 'https://via.placeholder.com/40' }
                      }
                      style={styles.tenantImage}
                    />
                    <Text style={styles.tenantName}>{tenant.name}</Text>
                  </View>
                  <Icon
                    name={selectedTenants.includes(tenant.id) ? "check-circle" : "circle"}
                    size={24}
                    color={selectedTenants.includes(tenant.id) ? "#2563EB" : "#D1D5DB"}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.anonymousButton}
              onPress={() => {
                setIsAnonymous(!isAnonymous);
                if (!isAnonymous) setSelectedTenants([]);
              }}
            >
              <Icon
                name={isAnonymous ? "check-square" : "square"}
                size={24}
                color={isAnonymous ? "#2563EB" : "#D1D5DB"}
              />
              <Text style={[
                styles.anonymousText,
                isAnonymous && styles.anonymousTextSelected
              ]}>
                Submit Anonymously
              </Text>
            </TouchableOpacity>
          </View>
        )} */}

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

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitText}>Submit Report</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  tenantList: {
    maxHeight: 200,
  },
  tenantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  selectedTenantItem: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
    borderWidth: 1,
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tenantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  tenantName: {
    fontSize: 16,
    color: '#1F2937',
  },
  anonymousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
  anonymousText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4B5563',
  },
  anonymousTextSelected: {
    color: '#2563EB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  chipImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
  },
  chipText: {
    fontSize: 14,
    color: '#2563EB',
    marginRight: 4,
    maxWidth: 100, // Limit text width
  },
  chipRemove: {
    padding: 2,
  },
  selectTenantsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  selectTenantsText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6B7280',
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
    marginBottom: 70,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  chipImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
  },
  chipText: {
    fontSize: 14,
    color: '#2563EB',
    marginRight: 4,
    maxWidth: 100, // Limit text width
  },
  chipRemove: {
    padding: 2,
  },
  selectTenantsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  selectTenantsText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6B7280',
  },
});

export default ReportScreen;