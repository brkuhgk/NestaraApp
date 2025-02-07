import React, { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/app/context/auth';


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

const ProfileScreen = () => {

  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const [activeTab, setActiveTab] = useState('overview');

  const userRatings = {
    cleanliness: 850,
    behavior: 920,
    payment: 980,
    maintenance: 760,
    communication: 890
  };

  const RatingBar = ({ label, value }: { label: string; value: number }) => (
    <View style={styles.ratingBar}>
      <View style={styles.ratingHeader}>
        <Text style={styles.ratingLabel}>{label}</Text>
        <Text style={styles.ratingValue}>{value}/1000</Text>
      </View>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${value/10}%` }]} />
      </View>
    </View>
  );

  return (
    <>
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://placehold.jp/3d4070/ffffff/150x150.png' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit-2" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.bio}>Friendly roommate | Clean & organized | Early bird </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>880</Text>
            <Text style={styles.statLabel}>Overall Rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Months</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Avg. Score</Text>
          </View>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabs}>
        {['Overview', 'History', 'Reviews'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab.toLowerCase() && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.toLowerCase())}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.toLowerCase() && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Rating Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rating Metrics</Text>
        <RatingBar label="Cleanliness" value={userRatings.cleanliness} />
        <RatingBar label="Behavior & Cooperation" value={userRatings.behavior} />
        <RatingBar label="Payment History" value={userRatings.payment} />
        <RatingBar label="Maintenance" value={userRatings.maintenance} />
        <RatingBar label="Communication" value={userRatings.communication} />
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


        <TouchableOpacity style={styles.actionButton}
        onPress={() => router.push('/(modals)/help')}
        >
          <Icon name="help-circle" size={24} color="#4B5563" />
          <Text style={styles.actionText}>Help</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}
        onPress={handleLogout}
        >
          <Icon name="log-out" size={24} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
    </>
    
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
});

export default ProfileScreen;