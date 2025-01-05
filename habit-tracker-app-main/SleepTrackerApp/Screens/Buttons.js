import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const sleepIcon = require('../assets/sleep_icon.png');
const habitIcon = require('../assets/habit_icon.png');
const stressIcon = require('../assets/stress_icon.png');
const gameIcon = require('../assets/game_icon.png');

const Buttons = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>What do you expect?</Text>
      <Text style={styles.subHeaderText}>Let us know you better</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log('Sleep Monitor')}
          activeOpacity={0.8} // Adjust opacity on press
        >
          <Image source={sleepIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Sleep Monitor</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('HabitWelcome')}
          activeOpacity={0.8}
        >
          <Image source={habitIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Habit Tracker</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => console.log('Stress Monitor')}
          activeOpacity={0.8}
        >
          <Image source={stressIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Stress Monitor</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => console.log('Gamification')}
          activeOpacity={0.8}
        >
          <Image source={gameIcon} style={styles.icon} />
          <Text style={styles.buttonText}>Gamification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    color: '#1a237e',
    fontSize: 36, // Reduced slightly for better fit on small screens
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  subHeaderText: {
    color: '#37474f',
    fontSize: 22, // Slightly reduced for better fit
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed to space-between for better alignment
    width: '100%',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#5c6bc0',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 12,
    width: '45%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 20, // Reduced slightly for better fit
    fontWeight: '500',
    marginTop: 5,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
});

export default Buttons;
