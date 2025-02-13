import api from "./client";



export const ratingService = {
    getUserRatings: (userId) => 
      api.get(`/ratings/${userId}`),
    
    getRatingHistory: (userId) => 
      api.get(`/ratings/${userId}/history`),
    
    updateRating: (userId, data) => 
      api.post(`/ratings/${userId}/update`, data)
  };