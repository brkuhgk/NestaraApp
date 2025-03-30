// store/useTopicStore.ts
import { create } from 'zustand';
import { VoteType } from '@/services/api/topic.service';


interface TopicVoteMap {
  [topicId: string]: {
    userId: string;
    voteType: VoteType;
  };
}

interface TopicVote {
  count: number;
}

interface TopicCreator {
  id: string;
  name: string;
}

export interface Topic {
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
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

interface TopicState {
  topics: Topic[];
  
  userVotes: TopicVoteMap;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTopics: (topics: Topic[]) => void;
  addTopic: (topic: Topic) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  setLoading: (loading: boolean) => void;

  setError: (error: string | null) => void;
  
  // Getters
  getTopicsByType: (type: Topic['type']) => Topic[];
  getTopicsByStatus: (status: Topic['status']) => Topic[];
  getActiveTopics: () => Topic[];


  // Vote related actions
  updateTopicVotes: (topicId: string, voteCount: number) => void;
  setUserVote: (topicId: string, userId: string, voteType: VoteType) => void;
  getUserVote: (topicId: string, userId: string) => VoteType | null;
  clearUserVote: (topicId: string, userId: string) => void;
}

export const useTopicStore = create<TopicState>((set, get) => ({
  topics: [],
  userVotes: {},
  isLoading: false,
  error: null,

  // Actions
  setTopics: (topics) => {
    console.log('[TopicStore] Setting topics:', { count: topics.length });
    set({ topics });
  },

  addTopic: (topic) => {
    console.log('[TopicStore] Adding topic:', { id: topic.id, type: topic.type });
    set((state) => ({
      topics: [...state.topics, topic]
    }));
  },

  updateTopic: (id, updates) => {
    console.log('[TopicStore] Updating topic:', { id, updates });
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === id ? { ...topic, ...updates } : topic
      )
    }));
  },

  setLoading: (loading) => {
    console.log('[TopicStore] Setting loading:', loading);
    set({ isLoading: loading });
  },

  setError: (error) => {
    console.log('[TopicStore] Setting error:', error);
    set({ error });
  },

  // Getters
  getTopicsByType: (type) => {
    const state = get();
    const filtered = state.topics.filter(topic => topic.type === type);
    console.log('[TopicStore] Getting topics by type:', { type, count: filtered.length });
    return filtered;
  },

  getTopicsByStatus: (status) => {
    const state = get();
    const filtered = state.topics.filter(topic => topic.status === status);
    console.log('[TopicStore] Getting topics by status:', { status, count: filtered.length });
    return filtered;
  },

  getActiveTopics: () => {
    const state = get();
    const active = state.topics.filter(topic => topic.status === 'active');
    console.log('[TopicStore] Getting active topics:', { count: active.length });
    return active;
  },

  // Vote related methods
  updateTopicVotes: (topicId, voteCount) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId
          ? { ...topic, votes: [{ count: voteCount }] }
          : topic
      ),
    })),

  setUserVote: (topicId, userId, voteType) =>
    set((state) => ({
      userVotes: {
        ...state.userVotes,
        [topicId]: { userId, voteType }
      }
    })),

  getUserVote: (topicId, userId) => {
    const state = get();
    const vote = state.userVotes[topicId];
    return vote?.userId === userId ? vote.voteType : null;
  },

  clearUserVote: (topicId, userId) =>
    set((state) => {
      const { [topicId]: _, ...rest } = state.userVotes;
      return { userVotes: rest };
    }),
}));