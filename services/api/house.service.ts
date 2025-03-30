// services/api/house.service.ts
import api from './client';
import { House, HouseMember } from '@/store/useHouseStore';

interface JoinHouseRequest {
  address: string;
  identifier: string;
}

interface CreateHouseRequest {
  name: string;
  address: string;
  maintainers?: string[];
}

interface UpdateHouseRequest {
  name?: string;
  address?: string;
  maintainers?: string[];
}

interface JoinRequestResponse {
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
}

export const houseService = {
  // House Operations
  getHouse: async (houseId: string): Promise<House> => {
    try {
      const response = await api.get(`/houses/${houseId}`);
      // console.log('house service response /house/${houseId}', response);
      return response;
    } catch (error) {
      console.log('Error fetching house:', error);
      throw error;
    }
  },

  getHouses: async (): Promise<House[]> => {
    try {
      const response = await api.get('/houses');
      return response.data;
    } catch (error) {
      console.error('Error fetching houses:', error);
      throw error;
    }
  },

  createHouse: async (data: CreateHouseRequest): Promise<House> => {
    try {
      const response = await api.post('/houses', data);
      return response.data;
    } catch (error) {
      console.error('Error creating house:', error);
      throw error;
    }
  },

  updateHouse: async (houseId: string, data: UpdateHouseRequest): Promise<House> => {
    try {
      const response = await api.put(`/houses/${houseId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating house:', error);
      throw error;
    }
  },

  deleteHouse: async (houseId: string): Promise<void> => {
    try {
      await api.delete(`/houses/${houseId}`);
    } catch (error) {
      console.error('Error deleting house:', error);
      throw error;
    }
  },

  // Member Operations
  getMembers: async (houseId: string): Promise<HouseMember[]> => {
    try {
      const response = await api.get(`/houses/${houseId}/members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  addMember: async (houseId: string, memberId: string): Promise<HouseMember> => {
    try {
      const response = await api.post(`/houses/${houseId}/members`, { memberId });
      return response;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  removeMember: async (houseId: string, memberId: string): Promise<void> => {
    try {
      await api.delete(`/houses/${houseId}/members/${memberId}`);
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  // Join Operations
  sendJoinRequest: async (data: JoinHouseRequest): Promise<JoinRequestResponse> => {
    try {
      const response = await api.post('/houses/join-request', data);
      return response.data;
    } catch (error) {
      console.error('Error sending join request:', error);
      throw error;
    }
  },

  respondToJoinRequest: async (
    requestId: string, 
    action: 'approve' | 'reject',
    message?: string
  ): Promise<void> => {
    try {
      await api.post(`/houses/join-request/${requestId}`, { action, message });
    } catch (error) {
      console.error('Error responding to join request:', error);
      throw error;
    }
  },

  getPendingJoinRequests: async (houseId: string): Promise<JoinRequestResponse[]> => {
    try {
      const response = await api.get(`/houses/${houseId}/join-requests`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending join requests:', error);
      throw error;
    }
  },

  // House Search and Verification
  verifyHouseAddress: async (address: string): Promise<boolean> => {
    try {
      const response = await api.post('/houses/verify-address', { address });
      return response.data.verified;
    } catch (error) {
      console.error('Error verifying house address:', error);
      throw error;
    }
  },

  searchHouses: async (query: string): Promise<House[]> => {
    try {
      const response = await api.get('/houses/search', { params: { query } });
      return response.data;
    } catch (error) {
      console.error('Error searching houses:', error);
      throw error;
    }
  },

  // House Statistics
  getHouseStatistics: async (houseId: string): Promise<{
    totalMembers: number;
    activeIssues: number;
    averageRating: number;
    maintenanceRequests: number;
  }> => {
    try {
      const response = await api.get(`/houses/${houseId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching house statistics:', error);
      throw error;
    }
  }
};