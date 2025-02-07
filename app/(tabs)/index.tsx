import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const HomeScreen = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const tenants = [
    {
      id: '1',
      name: 'John Doe',
      image: null,
      isManager: false,
      ratings: {
        cleanliness: 850,
        behavior: 920,
        payment: 980,
        maintenance: 760,
        communication: 890
      }
    },
    {
      id: '2',
      name: 'Jane Smith',
      image: null,
      isManager: true,
      ratings: {
        cleanliness: 900,
        behavior: 950,
        payment: 1000,
        maintenance: 880,
        communication: 920
      }
    }
  ];

  const RatingModal = ({ visible, tenant, onClose }) => (
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
                source={tenant?.image || { uri: 'https://via.placeholder.com/48' }}
                style={styles.modalAvatar}
              />
              <Text style={styles.modalUserName}>{tenant?.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Icon name="x" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.ratingsContainer}>
            {tenant && Object.entries(tenant.ratings).map(([key, value]) => (
              <View key={key} style={styles.ratingDetail}>
                <Text style={styles.ratingTitle}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <View style={styles.ratingBarContainer}>
                  <View style={styles.ratingBarBg}>
                    <View 
                      style={[
                        styles.ratingBarFill, 
                        { width: `${value/10}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.ratingNumber}>{value}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const TenantCard = ({ tenant }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => setSelectedUser(tenant)}
    >
      <View style={styles.cardHeader}>
        <Image
          source={tenant.image || { uri: 'https://via.placeholder.com/48' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{tenant.name}</Text>
          <View style={styles.badgeContainer}>
            <View style={[
              styles.badge,
              { backgroundColor: tenant.isManager ? '#FEE2E2' : '#D1FAE5' }
            ]}>
              <Text style={[
                styles.badgeText,
                { color: tenant.isManager ? '#DC2626' : '#059669' }
              ]}>
                {tenant.isManager ? 'Manager' : 'Tenant'}
              </Text>
            </View>
          </View>
        </View>
        <Icon name="chevron-right" size={24} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your House</Text>
          <Text style={styles.subtitle}>123 Main Street</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="bell" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Tenants</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Active Issues</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>850</Text>
          <Text style={styles.statLabel}>House Rating</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Tenants</Text>
        {tenants.map(tenant => (
          <TenantCard key={tenant.id} tenant={tenant} />
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