import React from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';




const ConflictsScreen = () => {
  const [filter, setFilter] = React.useState('general');

  const conflicts = [
    {
      id: 1,
      title: "Kitchen Cleanliness Issue",
      createdBy: "John Doe",
      createdFor: "Jane Smith",
      createdAt: "2024-02-05",
      description: "Dishes left unwashed for 3 days",
      status: "active",
      votes: 2,
      type: "Cleanliness"
    },
    {
        id: 1,
        title: "Kitchen Cleanliness Issue",
        createdBy: "John Doe",
        createdFor: "Jane Smith",
        createdAt: "2024-02-05",
        description: "Dishes left unwashed for 3 days",
        status: "resolved",
        votes: 2,
        type: "Cleanliness"
      },
      {
        id: 1,
        title: "Kitchen Cleanliness Issue",
        createdBy: "John Doe",
        createdFor: "Jane Smith",
        createdAt: "2024-02-05",
        description: "Dishes left unwashed for 3 days",
        status: "active",
        votes: 2,
        type: "Cleanliness"
      },
      {
        id: 1,
        title: "Kitchen Cleanliness Issue",
        createdBy: "John Doe",
        createdFor: "Jane Smith",
        createdAt: "2024-02-05",
        description: "Dishes left unwashed for 3 days",
        status: "active",
        votes: 2,
        type: "Cleanliness"
      }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'general': return '#6B7280';  // Gray
      case 'conflict': return '#EF4444'; // Red
      case 'mention': return '#10B981';  // Green
      default: return '#6B7280';
    }
  };

  const renderConflictCard = ({ item }: { item: typeof conflicts[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <View style={[
            styles.statusBadge, 
            item.status === 'active' ? styles.activeBadge : styles.resolvedBadge
          ]}>
            <Text style={[
              styles.statusText,
              item.status === 'active' ? styles.activeText : styles.resolvedText
            ]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          <View style={styles.userInfo}>
            <Text style={styles.infoText}>By: {item.createdBy}</Text>
            <Text style={styles.infoText}>For: {item.createdFor}</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="thumbs-up" size={16} color="#4B5563" />
            <Text style={styles.actionText}>Support ({item.votes})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="thumbs-down" size={16} color="#4B5563" />
            <Text style={styles.actionText}>Disagree</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.date}>{item.createdAt}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Conflicts</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterTabs}>
          {['general', 'conflict', 'mention'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              style={[
                styles.filterTab,
                filter === tab && styles.activeFilterTab
              ]}
            >
              <Text style={[
                styles.filterTabText,
                filter === tab && styles.activeFilterTabText
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={conflicts}
        renderItem={renderConflictCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.fab}>
        <Icon name="alert-triangle" size={24} color="#FFF" />
      </TouchableOpacity>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  filterButton: {
    padding: 8,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeFilterTab: {
    backgroundColor: '#DBEAFE',
  },
  filterTabText: {
    color: '#4B5563',
    fontSize: 14,
  },
  activeFilterTabText: {
    color: '#2563EB',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#FEE2E2',
  },
  resolvedBadge: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
  },
  activeText: {
    color: '#DC2626',
  },
  resolvedText: {
    color: '#059669',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    backgroundColor: '#2563EB',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ConflictsScreen;