import React from 'react';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function SettingsScreen() {
    const [notifications, setNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);
  return (
    <>
     
    <View style={styles.container}>
      

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem}
        onPress={() => router.push('/(modals)/edit-profile')}

        >
          <View style={styles.settingLeft}>
            <Icon name="user" size={20} color="#4B5563" />
            <Text style={styles.settingText}>Edit Profile</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}
      onPress={() => router.push('/(modals)/change-password')}
        >
          <View style={styles.settingLeft}>
            <Icon name="lock" size={20} color="#4B5563" />
            <Text style={styles.settingText}>Change Password</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Icon name="bell" size={20} color="#4B5563" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
            thumbColor={notifications ? "#2563EB" : "#F3F4F6"}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Icon name="moon" size={20} color="#4B5563" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
            thumbColor={darkMode ? "#2563EB" : "#F3F4F6"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Icon name="info" size={20} color="#4B5563" />
            <Text style={styles.settingText}>App Version</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </TouchableOpacity>
      </View>
    </View>
  



    </>
  );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3F4F6',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#FFF',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    section: {
      backgroundColor: '#FFF',
      marginTop: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
      paddingVertical: 12,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    settingText: {
      fontSize: 16,
      marginLeft: 12,
    },
    versionText: {
      fontSize: 14,
      color: '#6B7280',
    }
  });

  export default SettingsScreen;