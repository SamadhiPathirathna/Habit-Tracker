import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HabitWelcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Habit Tracker</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainTabs')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: 'purple', padding: 15, borderRadius: 5, alignItems: 'center', width: '80%' },
  buttonText: { color: 'white', fontSize: 18 },
});

export default HabitWelcome;
