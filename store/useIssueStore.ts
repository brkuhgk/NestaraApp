// src/store/useIssueStore.ts
import {create} from 'zustand';

interface Issue {
  id: string;
  type: 'general' | 'conflict' | 'mentions';
  category: 'cleanliness' | 'behavior' | 'payment' | 'maintenance' | 'communication';
  description: string;
  createdBy: string;
  createdFor: string[];
  images: string[];
  isAnonymous: boolean;
  status: 'active' | 'resolved' | 'archived';
  votes: {
    up: string[];   // user IDs who upvoted
    down: string[]; // user IDs who downvoted
  };
  createdAt: string;
  updatedAt: string;
}

interface IssueState {
  issues: Record<string, Issue>;  // key: issueId
  filters: {
    type: Issue['type'] | 'all';
    category: Issue['category'] | 'all';
    status: Issue['status'] | 'all';
  };
  
  // Actions
  addIssue: (issue: Issue) => void;
  updateIssue: (issueId: string, data: Partial<Issue>) => void;
  deleteIssue: (issueId: string) => void;
  setFilters: (filters: Partial<IssueState['filters']>) => void;
  voteIssue: (issueId: string, userId: string, voteType: 'up' | 'down') => void;
  
  // Getters
  getFilteredIssues: () => Issue[];
  getUserIssues: (userId: string) => Issue[];
  getActiveConflicts: () => Issue[];
}

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: {},
  filters: {
    type: 'all',
    category: 'all',
    status: 'all'
  },

  addIssue: (issue) => set((state) => ({
    issues: { ...state.issues, [issue.id]: issue }
  })),

  updateIssue: (issueId, data) => set((state) => ({
    issues: {
      ...state.issues,
      [issueId]: { ...state.issues[issueId], ...data }
    }
  })),

  deleteIssue: (issueId) => set((state) => {
    const { [issueId]: _, ...rest } = state.issues;
    return { issues: rest };
  }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  voteIssue: (issueId, userId, voteType) => set((state) => {
    const issue = state.issues[issueId];
    if (!issue) return state;

    // Remove user from both vote arrays first
    const newUpVotes = issue.votes.up.filter(id => id !== userId);
    const newDownVotes = issue.votes.down.filter(id => id !== userId);

    // Add user to appropriate vote array
    if (voteType === 'up') newUpVotes.push(userId);
    else newDownVotes.push(userId);

    return {
      issues: {
        ...state.issues,
        [issueId]: {
          ...issue,
          votes: {
            up: newUpVotes,
            down: newDownVotes
          }
        }
      }
    };
  }),

  getFilteredIssues: () => {
    const state = get();
    return Object.values(state.issues).filter(issue => {
      if (state.filters.type !== 'all' && issue.type !== state.filters.type) return false;
      if (state.filters.category !== 'all' && issue.category !== state.filters.category) return false;
      if (state.filters.status !== 'all' && issue.status !== state.filters.status) return false;
      return true;
    });
  },

  getUserIssues: (userId) => {
    return Object.values(get().issues).filter(issue => 
      issue.createdBy === userId || issue.createdFor.includes(userId)
    );
  },

  getActiveConflicts: () => {
    return Object.values(get().issues).filter(issue => 
      issue.type === 'conflict' && issue.status === 'active'
    );
  }
}));