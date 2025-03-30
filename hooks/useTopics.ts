// hooks/useTopics.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useTopicStore, Topic } from '@/store/useTopicStore';
import { topicService } from '@/services/api/topic.service';

interface UseTopicsOptions {
  enabled?: boolean;
  onSuccess?: (data: Topic[]) => void;
  onError?: (error: any) => void;
}

export function useTopics(options: UseTopicsOptions = {}) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { 
    setTopics,
    topics,
    setLoading,
    setError,
    getTopicsByType,
    getTopicsByStatus,
    getActiveTopics
  } = useTopicStore();

  // console.log('[useTopics] Initializing with options:', {
  //   enabled: options.enabled,
  //   userId: user?.id,
  //   houseId: user?.houseId
  // });

  const {
    data,
    isLoading,
    error,
    isFetching,
    refetch: queryRefetch
  } = useQuery({
    queryKey: ['topics', user?.houseId],
    queryFn: async () => {
      // console.log('[useTopics] Fetching topics for house:', user?.houseId);
      setLoading(true);
      try {
        if (!user?.houseId) {
          throw new Error('No house ID available');
        }
        console.log('[useTopics] Fetching topics for house:', user?.houseId);
        const response = await topicService.getHouseTopics(user.houseId);
        // console.log('[useTopics] Response:====================================', response);

        console.log('[useTopics] Topics fetched successfully:', {
          count: response?.length,
          active: response?.filter(t => t.status === 'active').length
        });
        setTopics(response);
        return response;
      } catch (err) {
        console.error('[useTopics] Error fetching topics:', err);
        setError(err?.message || 'Failed to fetch topics');
        throw err;
      } finally {
        setLoading(false);
      }
      
    },
    
    enabled: !!user?.houseId && options.enabled !== false,
    onSuccess: (data) => {
      // console.log('[useTopics] Setting topics in store:', { count: data?.length });
      setTopics(data);
      options.onSuccess?.(data);
    },
    onError: (err) => {
      console.error('[useTopics] Query error:', err);
      options.onError?.(err);
    },
    staleTime: Infinity, // 5 minutes
    cacheTime: Infinity, // 30 minutes
    // refetchInterval: 1000
  });

  const refetch = async () => {
    console.log('[useTopics] Manually refetching topics');
    try {
      const result = await queryRefetch();
      // console.log('[useTopics] Refetch successful:', {
      //   count: result.data?.length
      // });
      return result;
    } catch (err) {
      console.error('[useTopics] Refetch error:', err);
      throw err;
    }
  };

  const invalidateTopics = () => {
    console.log('[useTopics] Invalidating topics cache');
    if (user?.houseId) {
      queryClient.invalidateQueries(['topics', user.houseId]);
    }
  };
  // console.log('[useTopics] Topics:=========================', topics);

  // Computed values with debug logs
  const activeTopicsCount = topics?.filter(t => t.status === 'archived').length;
  
  // console.log("activeTopicsCount=================================================", activeTopicsCount)
  
  const conflictTopicsCount = topics.filter(t => 
    t.type === 'conflict' && t.status === 'archived'
  ).length;

  console.log('[useTopics] Current state:', {
    totalTopics: topics.length,
    activeTopics: activeTopicsCount,
    conflictTopics: conflictTopicsCount,
    isLoading,
    isFetching,
    hasError: !!error
  });

  return {
    // Data
    topics,
    data,
    
    // Loading states
    isLoading,
    isFetching,
    error,
    
    // Actions
    refetch,
    invalidateTopics,
    
    // Getters
    getTopicsByType,
    getTopicsByStatus,
    getActiveTopics,
    
    // Computed values
    activeTopicsCount,
    conflictTopicsCount,
  };
}