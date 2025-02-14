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
  user?: {
    id: string;
    name: string;
  };
}

export interface CreateTimeBlockInput {
  house_id: string;
  user_id: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
}

class TimeBlockService {
  async getTimeBlocks(houseId: string, date: string): Promise<TimeBlock[]> {
    try {
      const response = await api.get(`/time-blocks`, {
        params: { house_id: houseId, date }
      });
      return response;
    } catch (error) {
      console.error('Error fetching time blocks:', error);
      throw error;
    }
  }

  async createTimeBlock(data: CreateTimeBlockInput): Promise<TimeBlock> {
    try {
      const response = await api.post('/time-blocks', data);
      return response;
    } catch (error) {
      console.error('Error creating time block:', error);
      throw error;
    }
  }

  async deleteTimeBlock(id: string): Promise<void> {
    try {
      await api.delete(`/time-blocks/${id}`);
    } catch (error) {
      console.error('Error deleting time block:', error);
      throw error;
    }
  }
}

export const timeBlockService = new TimeBlockService();