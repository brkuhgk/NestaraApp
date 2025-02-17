// hooks/useTimeBlocks.ts
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeBlockService, TimeBlock, CreateTimeBlockInput } from '@/services/api/timeBlock.service';

export const useTimeBlocks = (houseId: string, date: string) => {
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState('Kitchen');

  console.log('[useTimeBlocks] Init params:', { houseId, date, selectedLocation });

  // Fetch time blocks
  const {
    data: timeBlocks,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['timeBlocks', houseId, date],
    queryFn: async () => {
      console.log('[useTimeBlocks] Fetching blocks for:', { houseId, date });
      try {
        const response = await timeBlockService.searchTimeBlocks({ 
          house_id: houseId, 
          date 
        });
        
        // Ensure we always return an array
        const blocks = Array.isArray(response) ? response : [];
        console.log('[useTimeBlocks] Fetched blocks:', blocks);
        return blocks;
      } catch (error) {
        console.error('[useTimeBlocks] Error fetching blocks:', error);
        return []; // Return empty array on error
      }
    },
    enabled: Boolean(houseId) && Boolean(date),
    initialData: [], // Provide initial empty array
  });

  // Create time block mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateTimeBlockInput) => {
      console.log('[useTimeBlocks] Creating block:', data);
      return timeBlockService.createTimeBlock(data);
    },
    onSuccess: (newBlock) => {
      console.log('[useTimeBlocks] Created block:', newBlock.id);
      queryClient.invalidateQueries(['timeBlocks', houseId, date]);
    },
    onError: (error) => {
      console.error('[useTimeBlocks] Create error:', error);
    }
  });

  // Delete time block mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('[useTimeBlocks] Deleting block:', id);
      return timeBlockService.deleteTimeBlock(id);
    },
    onSuccess: (_, deletedId) => {
      console.log('[useTimeBlocks] Deleted block:', deletedId);
      queryClient.invalidateQueries(['timeBlocks', houseId, date]);
    },
    onError: (error) => {
      console.error('[useTimeBlocks] Delete error:', error);
    }
  });

  // Filter blocks by location
  const filteredBlocks = useCallback(() => {
    // Ensure timeBlocks is an array
    const blocks = Array.isArray(timeBlocks) ? timeBlocks : [];
    const filtered = blocks.filter(block => block.location === selectedLocation);
    console.log('[useTimeBlocks] Filtered blocks:', { 
      location: selectedLocation, 
      total: blocks.length,
      filtered: filtered.length 
    });
    return filtered;
  }, [timeBlocks, selectedLocation]);

  // Validate time block
  const validateTimeBlock = useCallback((startTime: Date, endTime: Date): boolean => {
    console.log('[useTimeBlocks] Validating:', { startTime, endTime });
    
    if (endTime <= startTime) {
      console.log('[useTimeBlocks] Invalid time range');
      return false;
    }

    const newBlockStart = startTime.getHours() * 60 + startTime.getMinutes();
    const newBlockEnd = endTime.getHours() * 60 + endTime.getMinutes();

    // Ensure timeBlocks is an array
    const blocks = Array.isArray(timeBlocks) ? timeBlocks : [];
    
    const hasOverlap = blocks
      .filter(block => block.location === selectedLocation)
      .some(block => {
        const blockStart = new Date(`2000-01-01T${block.start_time}`);
        const blockEnd = new Date(`2000-01-01T${block.end_time}`);
        const existingStart = blockStart.getHours() * 60 + blockStart.getMinutes();
        const existingEnd = blockEnd.getHours() * 60 + blockEnd.getMinutes();

        const overlaps = (newBlockStart < existingEnd && newBlockEnd > existingStart);
        if (overlaps) {
          console.log('[useTimeBlocks] Overlap found:', {
            blockId: block.id,
            time: `${block.start_time}-${block.end_time}`
          });
        }
        return overlaps;
      });

    return !hasOverlap;
  }, [timeBlocks, selectedLocation]);

  return {
    timeBlocks: filteredBlocks(),
    isLoading,
    error,
    selectedLocation,
    setSelectedLocation,
    createTimeBlock: createMutation.mutate,
    deleteTimeBlock: deleteMutation.mutate,
    validateTimeBlock,
    refetch,
    isCreating: createMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
};