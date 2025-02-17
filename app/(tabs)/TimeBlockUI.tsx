import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTimeBlocks } from '@/hooks/useTimeBlocks';
import { useHomeScreen } from '@/hooks/useHomeScreen';
import { useAuthStore } from '@/store/useAuthStore';
import { format } from 'date-fns';

const locations = ['Kitchen', 'Washroom', 'Hall'];

const TimeBlockModal = ({ 
  isVisible, 
  onClose, 
  selectedLocation, 
  selectedDate, 
  onSubmit,
  isSubmitting 
}) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const handleSubmit = () => {
    if (endTime <= startTime) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }
    onSubmit({
      startTime: format(startTime, 'HH:mm'),
      endTime: format(endTime, 'HH:mm')
    });
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Block Time</Text>
          
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Location</Text>
            <Text style={styles.modalValue}>{selectedLocation}</Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Date</Text>
            <Text style={styles.modalValue}>{format(selectedDate, 'PPP')}</Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Time Range</Text>
            <View style={styles.timeSelectionContainer}>
              <TouchableOpacity 
                style={styles.timeSelectButton}
                onPress={() => setStartTimePickerVisible(true)}
              >
                <Text style={styles.timeSelectText}>
                  {format(startTime, 'hh:mm a')}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.timeSelectText}>to</Text>
              
              <TouchableOpacity 
                style={styles.timeSelectButton}
                onPress={() => setEndTimePickerVisible(true)}
              >
                <Text style={styles.timeSelectText}>
                  {format(endTime, 'hh:mm a')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isStartTimePickerVisible}
            mode="time"
            onConfirm={(time) => {
              setStartTime(time);
              setStartTimePickerVisible(false);
            }}
            onCancel={() => setStartTimePickerVisible(false)}
          />

          <DateTimePickerModal
            isVisible={isEndTimePickerVisible}
            mode="time"
            onConfirm={(time) => {
              setEndTime(time);
              setEndTimePickerVisible(false);
            }}
            onCancel={() => setEndTimePickerVisible(false)}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.modalButtonText}>
                {isSubmitting ? 'Creating...' : 'Block Time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function TimeBlockUI() {
  const { user } = useAuthStore();
  const { members } = useHomeScreen();
  const houseId = members?.[0]?.user.house_id;
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLocationModalVisible, setLocationModalVisibility] = useState(false);
  const [isTimeBlockModalVisible, setTimeBlockModalVisible] = useState(false);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  const {
    timeBlocks,
    selectedLocation,
    setSelectedLocation,
    createTimeBlock,
    isLoading,
    isCreating,
    validateTimeBlock,
    error
  } = useTimeBlocks(houseId, formattedDate);

  const handleCreateTimeBlock = async ({ startTime, endTime }) => {
    if (!houseId || !user?.id) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    try {
      await createTimeBlock({
        house_id: houseId,
        user_id: user.id,
        location: selectedLocation,
        date: formattedDate,
        start_time: startTime,
        end_time: endTime
      });
      
      setTimeBlockModalVisible(false);
      Alert.alert('Success', 'Time block created successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create time block');
    }
  };

  const renderTimeBlocks = () => {
    if (isLoading) {
      return <Text style={styles.statusText}>Loading...</Text>;
    }

    if (error) {
      return <Text style={styles.statusText}>Error loading time blocks</Text>;
    }

    if (!timeBlocks.length) {
      return <Text style={styles.statusText}>No schedules available</Text>;
    }

    return timeBlocks.map((block, index) => {
      const startMinutes = timeToMinutes(block.start_time);
      const endMinutes = timeToMinutes(block.end_time);
      const duration = endMinutes - startMinutes;
      // Calculate position
    // Our timeline has 24 rows of 60px height each (1440px total)
    // Each minute should map to (60px / 60 minutes = 1px)
    const topPosition = startMinutes;
    const blockHeight = Math.max(duration, 30); // Minimum height of 30px for visibility

    console.log('[TimeBlockUI] Rendering block:', {
      id: block.id,
      startTime: block.start_time,
      endTime: block.end_time,
      startMinutes,
      endMinutes,
      duration,
      topPosition,
      blockHeight
    });

      return (
        <View
          key={block.id}
          style={[
            styles.timeBlock,
            {
              top: topPosition,
              height: blockHeight,
              backgroundColor: getUserColor(block.user_id),
            },
          ]}
        >
          <Text style={styles.blockText} numberOfLines={1} >{block.user?.name}</Text>
          <Text style={styles.blockTimeText}>
            {format(new Date(`2000-01-01T${block.start_time}`), 'h:mm a')} - 
            {format(new Date(`2000-01-01T${block.end_time}`), 'h:mm a')}
          </Text>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={() => setLocationModalVisibility(true)} 
          style={styles.locationButton}
        >
          <Text style={styles.locationButtonText}>{selectedLocation}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setDatePickerVisibility(true)} 
          style={styles.dateButton}
        >
          <Text style={styles.dateText}>{format(selectedDate, 'PPP')}</Text>
        </TouchableOpacity>

        <ScrollView style={styles.timelineContainer} 
        contentContainerStyle={{ minHeight: 24 * 60 }} // 24 hours * 60px
        >
          {[...Array(24)].map((_, hour) => (
            <View key={hour} style={styles.timelineRow}>
              <Text style={styles.timelineText}>
                {format(new Date().setHours(hour, 0), 'h a')}
              </Text>
            </View>
          ))}
          {renderTimeBlocks()}
        </ScrollView>

        <TouchableOpacity 
          style={styles.blockButton}
          onPress={() => setTimeBlockModalVisible(true)}
          disabled={isCreating}
        >
          <Text style={styles.blockButtonText}>
            {isCreating ? 'Creating...' : 'Block Time'}
          </Text>
        </TouchableOpacity>

        {/* Location Selection Modal */}
        <Modal
          visible={isLocationModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setLocationModalVisibility(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={locations}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedLocation(item);
                      setLocationModalVisibility(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            </View>
          </View>
        </Modal>

        {/* Date Picker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setSelectedDate(date);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />

        {/* Time Block Modal */}
        <TimeBlockModal
          isVisible={isTimeBlockModalVisible}
          onClose={() => setTimeBlockModalVisible(false)}
          selectedLocation={selectedLocation}
          selectedDate={selectedDate}
          onSubmit={handleCreateTimeBlock}
          isSubmitting={isCreating}
        />
      </View>
    </SafeAreaView>
  );
}

// Helper functions
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const getUserColor = (userId: string): string => {
  const colors = [
    '#A3E4D7', '#AED6F1', '#F5B7B1', '#F9E79F',
    '#D2B4DE', '#F1948A', '#85C1E9', '#82E0AA'
  ];
  const index = userId.split('').reduce((acc, char) => 
    acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },

  // Button Styles
  locationButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationButtonText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  dateButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  blockButton: {
    padding: 16,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Timeline Styles
  timelineContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    position: 'relative', // Important for absolute positioning of blocks
    paddingRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineRow: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingLeft: 12,
    justifyContent: 'center',
  },
  timelineText: {
    fontSize: 14,
    color: '#6B7280',
  },
  timeBlock: {
    position: 'absolute',
    left: '25%',
    width: '70%',
    borderRadius: 6,
    padding: 8,
    minHeight: 30,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
  },
  blockText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  blockTimeText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  modalValue: {
    fontSize: 16,
    color: '#1F2937',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  timeSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeSelectButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  timeSelectText: {
    fontSize: 16,
    color: '#1F2937',
    paddingHorizontal: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  modalCancelButton: {
    backgroundColor: '#EF4444',
  },
  modalConfirmButton: {
    backgroundColor: '#2563EB',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1F2937',
  },

  // Status Styles
  statusText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
  },
});