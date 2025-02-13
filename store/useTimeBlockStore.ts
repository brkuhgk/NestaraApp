// src/store/useTimeBlockStore.ts
import {create} from 'zustand';

interface TimeBlock {
  id: string;
  userId: string;
  userName: string;
  location: 'kitchen' | 'bathroom' | 'hall';
  date: string;
  startTime: string;
  endTime: string;
}

interface TimeBlockState {
  schedules: Record<string, TimeBlock[]>; // key: date-location
  selectedLocation: string;
  selectedDate: string;
  
  // Actions
  setSelectedLocation: (location: string) => void;
  setSelectedDate: (date: string) => void;
  addTimeBlock: (block: TimeBlock) => void;
  removeTimeBlock: (blockId: string) => void;
  updateTimeBlock: (blockId: string, data: Partial<TimeBlock>) => void;
  getBlocksByDateAndLocation: (date: string, location: string) => TimeBlock[];
}

export const useTimeBlockStore = create<TimeBlockState>((set, get) => ({
  schedules: {},
  selectedLocation: 'kitchen',
  selectedDate: new Date().toISOString().split('T')[0],

  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setSelectedDate: (date) => set({ selectedDate: date }),

  addTimeBlock: (block) => set((state) => {
    const key = `${block.date}-${block.location}`;
    const existingBlocks = state.schedules[key] || [];
    return {
      schedules: {
        ...state.schedules,
        [key]: [...existingBlocks, block]
      }
    };
  }),

  removeTimeBlock: (blockId) => set((state) => {
    const newSchedules = { ...state.schedules };
    Object.keys(newSchedules).forEach(key => {
      newSchedules[key] = newSchedules[key].filter(block => block.id !== blockId);
    });
    return { schedules: newSchedules };
  }),

  updateTimeBlock: (blockId, data) => set((state) => {
    const newSchedules = { ...state.schedules };
    Object.keys(newSchedules).forEach(key => {
      newSchedules[key] = newSchedules[key].map(block => 
        block.id === blockId ? { ...block, ...data } : block
      );
    });
    return { schedules: newSchedules };
  }),

  getBlocksByDateAndLocation: (date, location) => {
    const key = `${date}-${location}`;
    return get().schedules[key] || [];
  }
}));