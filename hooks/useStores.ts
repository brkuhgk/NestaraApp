// src/hooks/useStores.ts
import { useAuthStore } from '@/store/useAuthStore';
import { useHouseStore } from '@/store/useHouseStore';
import { useTimeBlockStore } from '@/store/useTimeBlockStore';
import { useRatingStore } from '@/store/useRatingStore';
import { useIssueStore } from '@/store/useIssueStore';


import { Alert } from 'react-native';
// Combined hook for common operations
export function useStores() {
  const { user } = useAuthStore();
  const { currentHouse } = useHouseStore();
  const { addIssue, getActiveConflicts } = useIssueStore();
  const { updateRating } = useRatingStore();
  const { addTimeBlock } = useTimeBlockStore();

  const handleNewIssue = async (issueData) => {
    if (!user || !currentHouse) return;

    const newIssue = {
      ...issueData,
      createdBy: user.id,
      houseId: currentHouse.id,
      status: 'active',
      votes: { up: [], down: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // API call
      const response = await api.post('/topics', newIssue);
      // Update local state
      addIssue(response.data);
      
      // Update ratings if it's a conflict/mention
      if (['conflict', 'mentions'].includes(newIssue.type)) {
        newIssue.createdFor.forEach(userId => {
          updateRating(userId, newIssue.category as any, 
            newIssue.type === 'conflict' ? -50 : 10);
        });
      }
    } catch (error) {
      console.error('Error creating issue:', error);
      throw error;
    }
  };

  return {
    handleNewIssue,
    activeConflicts: getActiveConflicts(),
    currentHouse,
    user
  };
}

// Example usage in a component:
function ReportIssueScreen() {
  const { handleNewIssue, user } = useStores();
  
  const onSubmit = async (formData) => {
    try {
      await handleNewIssue(formData);
      Alert.alert('Success', 'Issue reported successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
}