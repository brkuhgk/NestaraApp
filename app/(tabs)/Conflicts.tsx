// ConflictsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTopics } from '@/hooks/useTopics';
import { useTopicVoting } from '@/hooks/useTopicVoting';


interface TopicVote {
  count: number;
}

interface TopicCreator {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  house_id: string;
  created_by: TopicCreator;
  created_for: string[];
  type: 'general' | 'conflict' | 'mentions';
  description: string;
  rating_parameter: string | null;
  images: string[] | null;
  votes: TopicVote[];
  status: 'active' | 'archived';
  userVoteType: 'upvote' | 'downvote' | null;

  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

const ConflictsScreen = () => {
  console.log('[ConflictsScreen] Rendering');
  const [filter, setFilter] = React.useState<'general' | 'conflict' | 'mentions'>('general');
  
  
  const { handleVote, isVoting } = useTopicVoting();

  const { 
    topics, 
    isLoading,
    isFetching,
    error,
    refetch 
  } = useTopics({ 
    enabled: true,
    onSuccess: (data) => {
      console.log('[ConflictsScreen] Topics loaded:', {
        total: data?.length,
        active: data?.filter(t => t.status === 'active').length
      });
    }
  });

  // Filter topics based on selected filter and status
  const filteredTopics = React.useMemo(() => {
    console.log('[ConflictsScreen] Filtering topics:', {
      filter,
      totalTopics: topics?.length
    });

    if (!topics) return [];
    return topics.filter(topic => 
      topic.type === filter && topic.status === 'active'
    );
  }, [topics, filter]);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('[ConflictsScreen] Date formatting error:', error);
      return timestamp;
    }
  };

  // const renderTopicCard =  React.useCallback(({ item }: { item: Topic }) => {

  //   const currentVote = getUserVote(item.id);

  //   console.log('[ConflictsScreen] Rendering topic:', {
  //     id: item.id,
  //     currentVote,
  //     voteCount: item.votes[0]?.count
  //   });

  //   return (
  //     <View style={styles.card}>
  //       <View style={styles.cardHeader}>
  //         <View>
  //           <View style={[
  //             styles.statusBadge, 
  //             item.type === 'conflict' ? styles.conflictBadge : 
  //             item.type === 'mentions' ? styles.mentionsBadge : 
  //             styles.generalBadge
  //           ]}>
  //             <Text style={[
  //               styles.statusText,
  //               item.type === 'conflict' ? styles.conflictText :
  //               item.type === 'mentions' ? styles.mentionsText :
  //               styles.generalText
  //             ]}>
  //               {item.type.toUpperCase()}
  //             </Text>
  //           </View>
  //           <Text style={styles.title}>{item.description}</Text>
            
  //           <View style={styles.userInfo}>
  //             <Text style={styles.infoText}>By: {item.created_by.name}</Text>
  //             {item.created_for.length > 0 && (
  //               <Text style={styles.infoText}>For: {item.created_for.length} members</Text>
  //             )}
  //           </View>
  //         </View>
  //         <Icon name="chevron-right" size={20} color="#9CA3AF" />
  //       </View>


  //       <View style={styles.cardFooter}>
  //       <View style={styles.actions}>
  //         <TouchableOpacity 
  //           style={[
  //             styles.actionButton,
  //             currentVote === 'upvote' && styles.activeAction
  //           ]}
  //           onPress={() => handleVote(item.id, 'upvote')}
  //           disabled={isVoting}
  //         >
  //           <Icon 
  //             name="thumbs-up" 
  //             size={16} 
  //             color={currentVote === 'upvote' ? '#2563EB' : '#4B5563'} 
  //           />
  //           <Text style={[
  //             styles.actionText,
  //             currentVote === 'upvote' && styles.activeActionText
  //           ]}>
  //             Support ({item.votes[0]?.count || 0})
  //           </Text>
  //         </TouchableOpacity>
          
  //         <TouchableOpacity 
  //           style={[
  //             styles.actionButton,
  //             currentVote === 'downvote' && styles.activeAction
  //           ]}
  //           onPress={() => handleVote(item.id, 'downvote')}
  //           disabled={isVoting}
  //         >
  //           <Icon 
  //             name="thumbs-down" 
  //             size={16} 
  //             color={currentVote === 'downvote' ? '#DC2626' : '#4B5563'} 
  //           />
  //           <Text style={[
  //             styles.actionText,
  //             currentVote === 'downvote' && styles.activeActionText
  //           ]}>
  //             Disagree
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //       <Text style={styles.date}>
  //         {formatTimestamp(item.created_at)}
  //       </Text>
  //     </View>
  //   </View>
  // );
  // }, [getUserVote, handleVote, isVoting]);


const renderTopicCard = React.useCallback(({ item }: { item: Topic }) => {
    // const { handleVote, isVoting } = useTopicVoting();
    
    console.log('[ConflictsScreen] Rendering topic card:', {
      topicId: item.id,
      userVoteType: item.userVoteType
    });
  
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View style={[
              styles.statusBadge, 
              item.type === 'conflict' ? styles.conflictBadge : 
              item.type === 'mentions' ? styles.mentionsBadge : 
              styles.generalBadge
            ]}>
              <Text style={[
                styles.statusText,
                item.type === 'conflict' ? styles.conflictText :
                item.type === 'mentions' ? styles.mentionsText :
                styles.generalText
              ]}>
                {item.type.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.title}>{item.description}</Text>
            
            <View style={styles.userInfo}>
              <Text style={styles.infoText}>By: {item.created_by.name}</Text>
              {item.created_for.length > 0 && (
                <Text style={styles.infoText}>For: {item.created_for.length} members</Text>
              )}
            </View>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </View>
  
        <View style={styles.cardFooter}>
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[
                styles.actionButton,
                item.userVoteType === 'upvote' && styles.activeAction
              ]}
              onPress={() => handleVote(item.id, 'upvote')}
              disabled={isVoting}
            >
              <Icon 
                name="thumbs-up" 
                size={16} 
                color={item.userVoteType === 'upvote' ? '#2563EB' : '#4B5563'} 
              />
              <Text style={[
                styles.actionText,
                item.userVoteType === 'upvote' && styles.activeActionText
              ]}>
                Support
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.actionButton,
                item.userVoteType === 'downvote' && styles.activeAction
              ]}
              onPress={() => handleVote(item.id, 'downvote')}
              disabled={isVoting}
            >
              <Icon 
                name="thumbs-down" 
                size={16} 
                color={item.userVoteType === 'downvote' ? '#DC2626' : '#4B5563'} 
              />
              <Text style={[
                styles.actionText,
                item.userVoteType === 'downvote' && styles.activeActionText
              ]}>
                Disagree
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.date}>
            {formatTimestamp(item.created_at)}
          </Text>
        </View>
      </View>
    );
  }, [handleVote]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Topics</Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => refetch()}
          >
            <Icon 
              name={isFetching ? "refresh-ccw" : "filter"} 
              size={20} 
              color="#000" 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterTabs}>
          {['general', 'conflict', 'mentions'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab as 'general' | 'conflict' | 'mentions')}
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
        data={filteredTopics}
        renderItem={renderTopicCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isFetching}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {filter} topics found</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab}>
        <Icon name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
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
  conflictBadge: {
    backgroundColor: '#FEE2E2',
  },
  mentionsBadge: {
    backgroundColor: '#D1FAE5',
  },
  generalBadge: {
    backgroundColor: '#E5E7EB',
  },
  statusText: {
    fontSize: 12,
  },
  conflictText: {
    color: '#DC2626',
  },
  mentionsText: {
    color: '#059669',
  },
  generalText: {
    color: '#374151',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
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
    bottom: 100,
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
  activeAction: {
    opacity: 0.8,
  },
  activeActionText: {
    color: '#2563EB',
  },
});

export default ConflictsScreen;