// hooks/useTopicVoting.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { topicService, VoteType } from '@/services/api/topic.service';
import { useTopicStore } from '@/store/useTopicStore';
import { useAuthStore } from '@/store/useAuthStore';

export function useTopicVoting() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { updateTopicVotes, setUserVote, getUserVote, clearUserVote } = useTopicStore();

  const { mutate: voteTopic, isLoading: isVoting } = useMutation({
    mutationFn: ({ topicId, voteType }: { topicId: string; voteType: VoteType }) =>
      topicService.voteTopic(topicId, voteType),
    onSuccess: (data, variables) => {
      const { topicId, voteType } = variables;
      console.log('[useTopicVoting] Vote successful:', { topicId, voteType, data });
      
      // Update vote count in store
      updateTopicVotes(topicId, data.votes[0].count);
      
      // Record user's vote
      if (user) {
        setUserVote(topicId, user.id, voteType);
      }

      // Invalidate topics query to refresh data
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    onError: (error, variables) => {
      console.error('[useTopicVoting] Vote failed:', { 
        error, 
        topicId: variables.topicId 
      });
      // Optionally handle error (show toast, etc.)
    }
  });

  const handleVote = async (topicId: string, voteType: VoteType) => {
    if (!user) {
      console.log('[useTopicVoting] No user found');
      return;
    }

    const currentVote = getUserVote(topicId, user.id);
    
    if (currentVote === voteType) {
      console.log('[useTopicVoting] Already voted this way');
      return;
    }

    // If user had voted differently before, clear their vote
    if (currentVote) {
      clearUserVote(topicId, user.id);
    }

    // Submit new vote
    voteTopic({ topicId, voteType });
  };

  return {
    handleVote,
    isVoting,
    getUserVote: (topicId: string) => user ? getUserVote(topicId, user.id) : null
  };
}