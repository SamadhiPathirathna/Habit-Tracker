import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, Alert, Platform, Pressable, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addHabit } from '../api';
import { AuthContext } from './AuthContext';
import { useNavigation } from "@react-navigation/native";

const Create = () => {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#FFD700");
  const [repeatMode, setRepeatMode] = useState("Everyday");
  const [timeOfDay, setTimeOfDay] = useState("Anytime");
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  };

  const toggleReminder = () => {
    setReminder(!reminder);
    if (!reminder) setShowTimePicker(true);
  };

  const onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || reminderTime;
    setShowTimePicker(Platform.OS === 'ios');
    setReminderTime(currentDate);
  };

  const addNewHabit = async () => {
    if (!title) {
      Alert.alert("Error", "Please enter a title for your habit.");
      return;
    }

    const habitDetails = {
      title,
      color: selectedColor,
      repeatMode,
      timeOfDay,
      reminder,
      reminderTime: reminder ? reminderTime.toISOString() : null,
    };

    try {
      await addHabit(token, habitDetails);
      Alert.alert("Success", "Habit added successfully");
      navigation.navigate("Tracker", { refresh: true });
    } catch (error) {
      console.error("Error adding a habit:", error);
      Alert.alert("Error", "Could not add habit");
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} style={styles.backIcon} />
      <Text style={styles.header}>Create Habit</Text>
      <TextInput
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
        placeholder="Habit name"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Color</Text>
      <View style={styles.colorContainer}>
        {["#FFD700", "#1877F2", "#ff8c00","#32CD32", "#de09cc", "#eb4034"].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedColor(item)}
            style={[
              styles.colorOption,
              { backgroundColor: selectedColor === item ? "#e6e6e6" : "transparent" }
            ]}
          >
            <View style={[styles.colorPreview, { backgroundColor: item }]} />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Repeat</Text>
      <Pressable
        onPress={() => setRepeatMode(repeatMode === "Everyday" ? "Weekly" : "Everyday")}
        style={styles.picker}
      >
        <Text style={styles.pickerText}>{repeatMode}</Text>
        <Feather name="chevron-right" size={24} color="black" />
      </Pressable>
      <Text style={styles.label}>Do it at</Text>
      <View style={styles.timeOfDayContainer}>
        {["Anytime", "Morning", "Afternoon", "Evening"].map((item, index) => (
          <Pressable
            key={index}
            onPress={() => setTimeOfDay(item)}
            style={[
              styles.timeOption,
              { backgroundColor: timeOfDay === item ? "#0071c5" : "#f0f0f0" }
            ]}
          >
            <Text style={[
              styles.timeText,
              { color: timeOfDay === item ? "white" : "black" }
            ]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.reminderContainer}>
        <Text style={styles.label}>Reminder</Text>
        <Switch value={reminder} onValueChange={toggleReminder} />
      </View>
      {showTimePicker && (
        <DateTimePicker
          value={reminderTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      <Pressable onPress={addNewHabit} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>SAVE</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  backIcon: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#E1EBEE",
    fontSize: 18,
    color: "#333",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666",
    marginBottom: 10,
  },
  colorContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  colorOption: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  picker: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerText: {
    color: "black",
    fontWeight: "bold",
  },
  timeOfDayContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  timeOption: {
    padding: 12,
    borderRadius: 8,
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  timeText: {
    fontWeight: "bold",
    marginLeft: 8,
  },
  reminderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  saveButton: {
    backgroundColor: "#0071c5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Create;
