// hooks/useTopicVoting.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { topicService } from '@/services/api/topic.service';
import { useAuthStore } from '@/store/useAuthStore';

export function useTopicVoting() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { mutate: voteTopic, isLoading: isVoting } = useMutation({
    mutationFn: async ({ topicId, voteType }: { topicId: string; voteType: 'upvote' | 'downvote' }) => {
      console.log('[useTopicVoting] Submitting vote:', { topicId, voteType });
      return topicService.voteTopic(topicId, voteType);
    },
    onMutate: async ({ topicId, voteType }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['topics']);

      // Get current topic data
      const topics = queryClient.getQueryData<Topic[]>(['topics']);
      const topicIndex = topics?.findIndex(t => t.id === topicId);

      if (topicIndex !== undefined && topicIndex !== -1) {
        // Create optimistic update
        const newTopics = [...(topics || [])];
        newTopics[topicIndex] = {
          ...newTopics[topicIndex],
          userVoteType: voteType
        };

        // Update cache optimistically
        queryClient.setQueryData(['topics'], newTopics);
      }

      return { previousTopics: topics };
    },
    onError: (error, variables, context) => {
      console.error('[useTopicVoting] Vote error:', error);
      // Revert optimistic update on error
      if (context?.previousTopics) {
        queryClient.setQueryData(['topics'], context.previousTopics);
      }
    },
    onSettled: () => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries(['topics']);
    }
  });

  const handleVote = (topicId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      console.log('[useTopicVoting] No user found');
      return;
    }

    voteTopic({ topicId, voteType });
  };

  return {
    handleVote,
    isVoting
  };
}