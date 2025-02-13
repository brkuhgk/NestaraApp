export interface TopicCreator {
  id: string;
  name: string;
}

export interface TopicVote {
  count: number;
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
  userVoteType: 'upvote' | 'downvote' | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}
