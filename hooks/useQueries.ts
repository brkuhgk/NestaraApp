// src/hooks/useQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { houseService, topicService, ratingService } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useHouseStore } from '@/store/useHouseStore';

export function useHouseData(houseId: string) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['house', houseId],
    queryFn: () => houseService.getHouse(houseId),
    onSuccess: (data) => {
      useHouseStore.getState().setCurrentHouse(data);
    }
  });
}

export function useHouseMembers(houseId: string) {
  return useQuery({
    queryKey: ['house', houseId, 'members'],
    queryFn: () => houseService.getMembers(houseId),
    // Refetch every minute if there are active conflicts
    refetchInterval: (data) => 
      data?.some(member => member.hasActiveConflicts) ? 60000 : false
  });
}

export function useTopics(houseId: string) {
  const queryClient = useQueryClient();

  const topicsQuery = useQuery({
    queryKey: ['topics', houseId],
    queryFn: () => topicService.getHouseTopics(houseId)
  });

  const createTopicMutation = useMutation({
    mutationFn: topicService.createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries(['topics', houseId]);
    }
  });

  const voteTopicMutation = useMutation({
    mutationFn: ({ topicId, voteType }) => 
      topicService.voteTopic(topicId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries(['topics', houseId]);
    }
  });

  return {
    topics: topicsQuery.data,
    isLoading: topicsQuery.isLoading,
    createTopic: createTopicMutation.mutate,
    voteTopic: voteTopicMutation.mutate
  };
}

export function useUserRatings(userId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['ratings', userId],
    queryFn: () => ratingService.getUserRatings(userId),
    onSuccess: (data) => {
      // Update rating store with new data
      Object.entries(data).forEach(([parameter, value]) => {
        useRatingStore.getState().updateRating(userId, parameter, value);
      });
    }
  });
}