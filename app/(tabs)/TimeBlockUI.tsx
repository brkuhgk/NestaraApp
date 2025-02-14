import React, { useEffect, useState } from 'react';
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
import { useHomeScreen } from '@/hooks/useHomeScreen';
import { useAuthStore } from '@/store/useAuthStore';
import { TimeBlock, timeBlockService } from '@/services/api/timeBlock.service';

interface ScheduleBlock {
  startTime: string;
  endTime: string;
  user: string;
  color: string;
}

interface ScheduleData {
  [date: string]: {
    [location: string]: ScheduleBlock[];
  };
}

interface TimeBlockData {
  house_id: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  user_id: string;
}

interface User {
  id: string;
  houseId: string;
}

interface TimeBlockSubmitResponse {
  // Add response type based on your API
  success: boolean;
  message?: string;
}

interface ScheduleBlock {
  startTime: string;
  endTime: string;
  user: string;
  color: string;
}

interface TimeBlockModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedLocation: string;
  selectedDate: Date;
  startTime: Date;
  endTime: Date;
  setStartTime: (date: Date) => void;
  setEndTime: (date: Date) => void;
  onSubmit: () => void;
  isStartTimePickerVisible: boolean;
  isEndTimePickerVisible: boolean;
  setStartTimePickerVisible: (visible: boolean) => void;
  setEndTimePickerVisible: (visible: boolean) => void;
}

const TimeBlockModal: React.FC<TimeBlockModalProps> = ({
  isVisible,
  onClose,
  selectedLocation,
  selectedDate,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  onSubmit,
  isStartTimePickerVisible,
  isEndTimePickerVisible,
  setStartTimePickerVisible,
  setEndTimePickerVisible,
}) => {
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
          
          {/* Location Display */}
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Location</Text>
            <Text style={styles.modalValue}>{selectedLocation}</Text>
          </View>

          {/* Date Display */}
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Date</Text>
            <Text style={styles.modalValue}>{selectedDate.toDateString()}</Text>
          </View>

          {/* Time Selection */}
          <View style={styles.modalSection}>
            <Text style={styles.modalLabel}>Time Range</Text>
            <View style={styles.timeSelectionContainer}>
              <TouchableOpacity 
                style={styles.timeSelectButton}
                onPress={() => setStartTimePickerVisible(true)}
              >
                <Text style={styles.timeSelectText}>
                  {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.timeSelectText}>to</Text>
              
              <TouchableOpacity 
                style={styles.timeSelectButton}
                onPress={() => setEndTimePickerVisible(true)}
              >
                <Text style={styles.timeSelectText}>
                  {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Pickers */}
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

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalConfirmButton]}
              onPress={onSubmit}
            >
              <Text style={styles.modalButtonText}>Block Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const scheduleData: ScheduleData = {
  '2023-01-01': {
    Kitchen: [
      { startTime: '5am', endTime: '6am', user: 'User2', color: '#A3E4D7' },
      { startTime: '6am', endTime: '7am', user: 'User3', color: '#AED6F1' },
    ],
    Washroom: [
      { startTime: '10am', endTime: '11am', user: 'User1', color: '#F5B7B1' },
      { startTime: '1pm', endTime: '2pm', user: 'User4', color: '#F9E79F' },
    ],
    Hall: [
      { startTime: '7am', endTime: '8am', user: 'User3', color: '#D2B4DE' },
      { startTime: '12pm', endTime: '1pm', user: 'User1', color: '#F1948A' },
    ],
  },
  '2023-10-02': {
    Kitchen: [
      { startTime: '7am', endTime: '8am', user: 'User1', color: '#A3E4D7' },
      { startTime: '8am', endTime: '9am', user: 'User2', color: '#AED6F1' },
    ],
    Washroom: [
      { startTime: '11am', endTime: '12pm', user: 'User3', color: '#F5B7B1' },
      { startTime: '2pm', endTime: '3pm', user: 'User4', color: '#F9E79F' },
    ],
    Hall: [
      { startTime: '9am', endTime: '10am', user: 'User2', color: '#D2B4DE' },
      { startTime: '1pm', endTime: '2pm', user: 'User3', color: '#F1948A' },
    ],
  },
};

const locations = ['Kitchen', 'Washroom', 'Hall'];

export default function TimeBlockUI() {

  const { user } = useAuthStore();
  const { members, isLoading: isHouseLoading } = useHomeScreen();
  const houseId = members?.[0]?.user.house_id; // Get house_id from first member

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState('Kitchen');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLocationModalVisible, setLocationModalVisibility] = useState(false);

  // New state for time block modal
  const [isTimeBlockModalVisible, setTimeBlockModalVisible] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  // Validation functions
  const validateTimeBlock = (): boolean => {
    if (endTime <= startTime) {
      Alert.alert('Error', 'End time must be after start time');
      return false;
    }

    const dateKey = formatDate(selectedDate);
    const schedule = scheduleData[dateKey]?.[selectedLocation] || [];
    
    const newBlockStart = timeToPosition(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const newBlockEnd = timeToPosition(endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    const hasOverlap = schedule.some(block => {
      const blockStart = timeToPosition(block.startTime);
      const blockEnd = timeToPosition(block.endTime);
      return (newBlockStart < blockEnd && newBlockEnd > blockStart);
    });

    if (hasOverlap) {
      Alert.alert('Error', 'Time block overlaps with existing block');
      return false;
    }
    return true;
  };

  // Handler for submitting time block
  const handleTimeBlockSubmit = async () => {
    try {
      if (!validateTimeBlock()) {
        return;
      }
      if (!houseId) {
        Alert.alert('Error', 'House ID not found');
        return;
      }
      setIsSubmitting(true);
        

      const timeBlockData: TimeBlockData = {
        house_id: houseId,
        user_id: user?.id || '',
        location: selectedLocation,
        date: formatDate(selectedDate),
        start_time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        end_time: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        
      };

      const response = await timeBlockService.createTimeBlock(timeBlockData);
      
      setTimeBlockModalVisible(false);
      Alert.alert('Success', 'Time block created successfully');
      //Refresh the time blocks
      fetchTimeBlocks();
      
      Alert.alert('Success', 'Time block created successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create time block');
    }finally {
      setIsSubmitting(false);
    }
  };
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);

const fetchTimeBlocks = async () => {
  if (!houseId) return;
  
  try {
    setIsLoadingBlocks(true);
    const date = formatDate(selectedDate);
    const blocks = await timeBlockService.getTimeBlocks(houseId, date);
    
    // Convert blocks to schedule format
    const formattedBlocks = blocks.map(block => ({
      startTime: formatTimeForDisplay(block.start_time),
      endTime: formatTimeForDisplay(block.end_time),
      user: block.user?.name || 'Unknown',
      color: getRandomColor(block.user_id), // Implement color generation based on user
      id: block.id
    }));

    setTimeBlocks(formattedBlocks);
  } catch (error) {
    console.error('Error fetching time blocks:', error);
    Alert.alert('Error', 'Failed to load time blocks');
  } finally {
    setIsLoadingBlocks(false);
  }
};

// Helper function to format time for display
const formatTimeForDisplay = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const displayHour = hour % 12 || 12;
  return `${displayHour}${ampm}`;
};

// Helper function to generate consistent colors for users
const getRandomColor = (userId: string) => {
  const colors = [
    '#A3E4D7', '#AED6F1', '#F5B7B1', '#F9E79F', 
    '#D2B4DE', '#F1948A', '#85C1E9', '#82E0AA'
  ];
  const index = userId.split('').reduce((acc, char) => 
    acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

// Add useEffect to fetch time blocks when date or location changes
useEffect(() => {
  fetchTimeBlocks();
}, [selectedDate, houseId]);
  
const handleLocationChange = (location: string): void => {
    console.log('Location changed to:', location);
    setSelectedLocation(location);
    setLocationModalVisibility(false);
};

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

interface HandleDateConfirm {
    (date: Date): void;
}

const handleDateConfirm: HandleDateConfirm = (date) => {
    console.log('Date selected:', date);
    setSelectedDate(date);
    hideDatePicker();
};

  const showLocationModal = () => {
    setLocationModalVisibility(true);
  };

  const hideLocationModal = () => {
    setLocationModalVisibility(false);
  };

  // Helper to format date to match scheduleData keys
interface FormatDate {
    (date: Date): string;
}

const formatDate: FormatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

  // Helper to map times to positions on the timeline
interface TimeToPosition {
    (time: string): number;
}

const timeToPosition: TimeToPosition = (time) => {
    const [hourString, modifier] = time.split(/am|pm/);
    let hour = parseInt(hourString);
    if (modifier === 'pm' && hour !== 12) hour += 12;
    if (modifier === 'am' && hour === 12) hour = 0;
    return hour * 60;
};

  const renderTimeBlocks = () => {
    const dateKey = formatDate(selectedDate);
    console.log('Rendering time blocks for:', selectedLocation, dateKey);
    const schedule = scheduleData[dateKey] && scheduleData[dateKey][selectedLocation];
    console.log('Schedule:', schedule);
    if (!schedule) return <Text style={styles.noScheduleText}>No schedule available</Text>;

    return schedule.map((block, index) => (
      <View
        key={index}
        style={[
          styles.timeBlock,
          {
            top: timeToPosition(block.startTime) / 2,
            height: (timeToPosition(block.endTime) - timeToPosition(block.startTime)) / 2,
            backgroundColor: block.color,
          },
        ]}
      >
        <Text style={styles.blockText}>{block.user}</Text>
        <Text style={styles.blockTimeText}>{`${block.startTime} - ${block.endTime}`}</Text>
      </View>
    ));
  };

  return (

    <SafeAreaView style={styles.container}>
    <View style={styles.container}>

      
      {/* Location Selection Button */}
      <TouchableOpacity onPress={showLocationModal} style={styles.locationButton}>
        <Text style={styles.locationButtonText}>{selectedLocation}</Text>
      </TouchableOpacity>
    {/* Add TimeBlock Modal */}
    <TimeBlockModal 
          isVisible={isTimeBlockModalVisible}
          onClose={() => setTimeBlockModalVisible(false)}
          selectedLocation={selectedLocation}
          selectedDate={selectedDate}
          startTime={startTime}
          endTime={endTime}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          onSubmit={handleTimeBlockSubmit}
          isStartTimePickerVisible={isStartTimePickerVisible}
          isEndTimePickerVisible={isEndTimePickerVisible}
          setStartTimePickerVisible={setStartTimePickerVisible}
          setEndTimePickerVisible={setEndTimePickerVisible}
        />
        
      {/* Location Selection Modal */}
      <Modal
        visible={isLocationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={hideLocationModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={locations}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleLocationChange(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity onPress={hideLocationModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
        <Text style={styles.dateText}>{selectedDate.toDateString() || 'Select Date'}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      {/* Timeline */}
      <ScrollView style={styles.timelineContainer}>
        {[...Array(24).keys()].map((hour) => (
          <View key={hour} style={styles.timelineRow}>
            <Text style={styles.timelineText}>
              {hour === 0
                ? '12am'
                : hour < 12
                ? `${hour}am`
                : hour === 12
                ? '12pm'
                : `${hour - 12}pm`}
            </Text>
          </View>
        ))}
        {renderTimeBlocks()}
      </ScrollView>
        
      {/* Update Block Time Button */}
      <TouchableOpacity 
          style={styles.blockButton}
          onPress={() => setTimeBlockModalVisible(true)}
        >
          <Text style={styles.blockButtonText}>Block Time</Text>
        </TouchableOpacity>
      
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  locationButton: {
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dateButton: {
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
  dateText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  timelineContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    position: 'relative',
  },
  timelineRow: {
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingLeft: 10,
  },
  timelineText: {
    fontSize: 14,
    color: '#666',
  },
  timeBlock: {
    position: 'absolute',
    left: '20%',
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  blockText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  blockTimeText: {
    color: '#fff',
    fontSize: 12,
  },
  blockButton: {
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  blockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noScheduleText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
    // New styles for TimeBlock Modal
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 20,
      color: '#1F2937',
    },
    modalSection: {
      marginBottom: 20,
      width: '100%',
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
      width: '100%',
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    modalCancelButton: {
      backgroundColor: '#EF4444',
    },
    modalConfirmButton: {
      backgroundColor: '#2563EB',
    },
    modalButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
    },
});