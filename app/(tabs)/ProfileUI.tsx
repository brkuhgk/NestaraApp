import React, { useState, useMemo } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/app/context/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useHouseStore } from '@/store/useHouseStore';
import { Alert, ActivityIndicator } from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useHomeScreen } from '@/hooks/useHomeScreen';
import { useImageUrl } from '@/hooks/useImageUrl';

const ProfileScreen = () => {
  const { user } = useAuthStore();
  const { houseData, isLoading: isHouseLoading, getMemberWithRatings, members } = useHomeScreen();
  const { logout } = useAuth();
  
  const memberRating = getMemberWithRatings(user?.id);
  console.log('[ProfileScreen] Member Rating:', user);
  // Use the image hook to get the user's profile image URL
  const { url: profileImageUrl, isLoading: isImageLoading } = useImageUrl(user?.image_key);

  // Calculate user ratings based on memberRating data
  const userRatings = useMemo(() => {
    if (!memberRating?.ratings?.data) return null;

    const ratingsData = memberRating.ratings.data;
    return ratingsData.reduce((acc, rating) => {
      switch (rating.parameter) {
        case 'rp1': return { ...acc, cleanliness: rating.value };
        case 'rp2': return { ...acc, behavior: rating.value };
        case 'rp3': return { ...acc, payment: rating.value };
        case 'rp4': return { ...acc, maintenance: rating.value };
        case 'rp5': return { ...acc, communication: rating.value };
        case 'mp1': return { ...acc, communication: rating.value };
        case 'mp2': return { ...acc, behavior: rating.value };
        case 'mp3': return { ...acc, maintenance: rating.value };
        default: return acc;
      }
    }, {
      cleanliness: 0,
      behavior: 0,
      payment: 0,
      maintenance: 0,
      communication: 0
    });
  }, [memberRating?.ratings?.data]);

  // Calculate overall rating
  const overallRating = useMemo(() => {
    if (!userRatings) return 0;
    const values = Object.values(userRatings);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [userRatings]);

  const RatingBar = ({ label, value, description }: { 
    label: string; 
    value: number;
    description: string;
  }) => (
    <View style={styles.ratingBar}>
      <View style={styles.ratingHeader}>
        <View>
          <Text style={styles.ratingLabel}>{label}</Text>
          <Text style={styles.ratingDescription}>{description}</Text>
        </View>
        <Text style={styles.ratingValue}>{value}/1000</Text>
      </View>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${value/10}%` }]} />
      </View>
    </View>
  );

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  if (isHouseLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {isImageLoading ? (
              <ActivityIndicator size="small" color="#2563EB" style={styles.profileImage} />
            ) : (
              <Image
                source={{ 
                  uri: profileImageUrl || 'https://placehold.jp/3d4070/ffffff/150x150.png' 
                }}
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/(modals)/edit-profile')}
            >
              <Icon name="edit-2" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{user?.name || 'No Name'}</Text>
          <Text style={styles.bio}>{user?.bio || 'No bio added yet'}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{overallRating}</Text>
              <Text style={styles.statLabel}>Overall Rating</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{members?.length || 0}</Text>
              <Text style={styles.statLabel}>House Members</Text>
            </View>
          </View>
        </View>

        {/* Rating Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating Metrics</Text>
          {user?.type === 'tenant' ? (
            <>
              <RatingBar 
                label="Cleanliness" 
                value={userRatings?.cleanliness || 0}
                description="How well you maintain cleanliness"
              />
              <RatingBar 
                label="Behavior & Cooperation" 
                value={userRatings?.behavior || 0}
                description="How well you cooperate with others"
              />
              <RatingBar 
                label="Payment History" 
                value={userRatings?.payment || 0}
                description="Timeliness of rent payments"
              />
              <RatingBar 
                label="Maintenance" 
                value={userRatings?.maintenance || 0}
                description="How well you maintain and report issues"
              />
              <RatingBar 
                label="Communication" 
                value={userRatings?.communication || 0}
                description="Quality of communication with others"
              />
            </>
          ) : (
            <>
              <RatingBar 
                label="Communication" 
                value={userRatings?.communication || 0}
                description="Quality of communication with tenants"
              />
              <RatingBar 
                label="Behavior" 
                value={userRatings?.behavior || 0}
                description="How well you cooperate"
              />
              <RatingBar 
                label="Maintenance" 
                value={userRatings?.maintenance || 0}
                description="Speed and quality of maintenance work"
              />
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(modals)/settings')}
          >
            <Icon name="settings" size={24} color="#4B5563" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(modals)/help')}
          >
            <Icon name="help-circle" size={24} color="#4B5563" />
            <Text style={styles.actionText}>Help</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Icon name="log-out" size={24} color="#DC2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#2563EB',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  tabText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2563EB',
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  ratingBar: {
    marginBottom: 16,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  quickActions: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#4B5563',
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#DC2626',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  ratingDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default ProfileScreen;