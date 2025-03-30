import api from "./client";

export type VoteType = 'upvote' | 'downvote';

export const topicService = {
    getHouseTopics: (houseId: string) => 
      api.get(`/topics/${houseId}`),
    
    createTopic: (data: any) => 
      api.post('/topics', data),
    
    voteTopic: (topicId: string, voteType: VoteType) => 
      api.post(`/topics/${topicId}/vote`, { voteType }),
    
    uploadImages: (topicId: string, formData:any) => 
      api.post(`/topics/${topicId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    
    getConflicts: (houseId:string) => 
      api.get(`/topics/house/${houseId}/conflicts`)
  };
  