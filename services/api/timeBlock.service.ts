// services/api/timeBlock.service.ts
import api from './client';

export interface TimeBlock {
  id: string;
  house_id: string;
  user_id: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface CreateTimeBlockInput {
  house_id: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
}

export interface SearchTimeBlocksParams {
  house_id: string;
  date: string;
}

class TimeBlockService {
  async searchTimeBlocks(params: SearchTimeBlocksParams): Promise<TimeBlock[]> {
    try {
      console.log('[TimeBlockService] Searching time blocks with params:', params);
      const response = await api.post('/time-blocks/search', params);
      console.log('[TimeBlockService] Search response:====================', response.status);
      // Check if response has the expected structure
      if (response?.status === 'success' && Array.isArray(response.data)) {
        console.log('[TimeBlockService] Successfully fetched time blocks:', response.data.length);
        return response.data;
      }
      
      console.warn('[TimeBlockService] Unexpected response structure:', response);
      return response.data;

    } catch (error) {
      console.error('[TimeBlockService] Error searching time blocks:', error);
      throw error;
    }
  }

  async createTimeBlock(data: CreateTimeBlockInput): Promise<TimeBlock> {
    try {
      console.log('[TimeBlockService] Creating time block with data:', data);
      const response = await api.post('/time-blocks', data);
      
      // Verify response structure
      if (response && typeof response === 'object' && 'id' in response) {
        console.log('[TimeBlockService] Successfully created time block:', response.id);
        return response;
      }
      
      console.warn('[TimeBlockService] Unexpected create response structure:', response);
      throw new Error('Invalid response structure from create time block');
    } catch (error) {
      console.error('[TimeBlockService] Error creating time block:', error);
      throw error;
    }
  }

  async deleteTimeBlock(id: string): Promise<void> {
    try {
      console.log('[TimeBlockService] Deleting time block:', id);
      await api.delete(`/time-blocks/${id}`);
      console.log('[TimeBlockService] Successfully deleted time block:', id);
    } catch (error) {
      console.error('[TimeBlockService] Error deleting time block:', error);
      throw error;
    }
  }
}

export const timeBlockService = new TimeBlockService();