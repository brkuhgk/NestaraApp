import { Image, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/home.png')} // Replace with the path to your dummy house image
          style={styles.houseImage}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Documents</ThemedText>
        <View style={styles.separator} />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="file-pdf-o" size={28} color="#fff" />
            <Text style={styles.iconButtonText}>Lease</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="file-pdf-o" size={28} color="#fff" />
            <Text style={styles.iconButtonText}>Pay Slips</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesome name="file-pdf-o" size={28} color="#fff" />
            <Text style={styles.iconButtonText}>Others</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
      <View style={styles.separator} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Maintenance</ThemedText>
        <View style={styles.separator} />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Raise Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Damage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Contact Owner</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  houseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  iconButtonText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
});
