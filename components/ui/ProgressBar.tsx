// components/ui/ProgressBar.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View 
          style={[
            styles.progress, 
            { width: `${progress}%` }
          ]} 
        />
      </View>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View 
            key={index}
            style={[
              styles.stepIndicator,
              index + 1 <= currentStep ? styles.completedStep : styles.incompleteStep
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  background: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stepIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  completedStep: {
    backgroundColor: '#2563EB',
  },
  incompleteStep: {
    backgroundColor: '#E5E7EB',
  },
});

export default ProgressBar;