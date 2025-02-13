import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,  
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { useHomeScreen } from '@/hooks/useHomeScreen';
// import { useTopics } from '@/hooks/useTopics';

const HomeScreen = () => {
  const { houseData, isLoading: isHouseLoading, getMemberWithRatings, members } = useHomeScreen();
  const [selectedUser, setSelectedUser] = useState(null);

  // const { 
  //   activeTopicsCount, 
  //   isLoading: isTopicsLoading,
  //   refetch 
  // } = useTopics({
  //   enabled: false // Don't load immediately
    
  // });

  // Load topics after initial render
  // useEffect(() => {
  //   let timer: NodeJS.Timeout;
  //   if (!isTopicsLoading) {
  //     timer = setTimeout(() => {
  //       refetch().catch(error => {
  //         console.error('Failed to load topics:', error);
  //       });
  //     }, 2000);
  //   }
  //   return () => clearTimeout(timer);
  // }, [isTopicsLoading]);

  const isLoading = isHouseLoading;

  // Get active issues count
  const activeIssuesCount = -1;
 
  // Calculate average house rating
  const calculateHouseRating = () => {
    if (!members?.length) return 0;
    const totalRatings = members.reduce((acc, member) => {
      const ratings = getMemberWithRatings(member.id)?.ratings;
      if (!ratings) return acc;
      const avgRating = Object.values(ratings).reduce((sum, val) => sum + val, 0) / Object.values(ratings).length;
      return acc + avgRating;
    }, 0);
    return Math.round(totalRatings / members.length);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  const RatingModal = ({ visible, tenant, onClose }) => {
    if (!tenant) return null;
  
    const memberData = getMemberWithRatings(tenant.id);
    const ratings = memberData?.ratings?.data?.filter(rating => rating.value !== null) || [];
    // console.log("[Rating Modal] ratings", ratings);
  
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.userHeaderInfo}>
                <Image
                  source={memberData?.image_url ? { uri: memberData.image_url } : { uri: 'https://via.placeholder.com/48' }}
                  style={styles.modalAvatar}
                />
                <Text style={styles.modalUserName}>{memberData?.name}</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Icon name="x" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.ratingsContainer}>
              {ratings.length > 0 ? (
                ratings.map((rating) => (
                  <View key={rating.parameter} style={styles.ratingDetail}>
                    <Text style={styles.ratingTitle}>
                      {rating.name}
                    </Text>
                    <View style={styles.ratingBarContainer}>
                      <View style={styles.ratingBarBg}>
                        <View 
                          style={[
                            styles.ratingBarFill, 
                            { width: `${(rating.value || 0) / 10}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.ratingNumber}>{rating.value || 'N/A'}</Text>
                    </View>
                    <Text style={styles.ratingDescription}>{rating.description}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noRatingsText}>No ratings available</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };
  const TenantCard = ({ memberId }) => {
    const member = getMemberWithRatings(memberId);
    // console.log("Tenant Card member",member);
    if (!member) return null;

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => setSelectedUser(member)}
      >
        <View style={styles.cardHeader}>
          <Image
            source={member.image_url ? { uri: member.image_url } : { uri: 'https://via.placeholder.com/48' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{member.name}</Text>
            <View style={styles.badgeContainer}>
              <View style={[
                styles.badge,
                { backgroundColor: member.type === 'maintainer' ? '#FEE2E2' : '#D1FAE5' }
              ]}>
                <Text style={[
                  styles.badgeText,
                  { color: member.type === 'maintainer' ? '#DC2626' : '#059669' }
                ]}>
                  {member.type === 'maintainer' ? 'Manager' : 'Tenant'}
                </Text>
              </View>
            </View>
          </View>
          <Icon name="chevron-right" size={24} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{houseData?.name}</Text>
          <Text style={styles.subtitle}>{houseData?.address}</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="bell" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{members?.length || 0}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        {/* <View style={styles.stat}>
          <Text style={styles.statValue}>{activeIssuesCount}</Text>
          <Text style={styles.statLabel}>Active Issues</Text>
        </View> */}
        <View style={styles.stat}>
          <Text style={styles.statValue}>{calculateHouseRating()}</Text>
          <Text style={styles.statLabel}>House Rating</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Members</Text>
        {members?.map(member => (
          // console.log("member.user.id",member.user.id),
          <TenantCard key={member.user.id} memberId={member.user.id} />
        ))}
      </ScrollView>

      <RatingModal 
        visible={selectedUser !== null}
        tenant={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
  },
  quickStats: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalUserName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  ratingsContainer: {
    marginTop: 16,
  },
  ratingDetail: {
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  ratingNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    width: 50,
  },
});

export default HomeScreen;