import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [selectedLocation, setSelectedLocation] = useState('Kitchen');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLocationModalVisible, setLocationModalVisibility] = useState(false);

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

      {/* Block Time Button */}
      <TouchableOpacity style={styles.blockButton}>
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
});