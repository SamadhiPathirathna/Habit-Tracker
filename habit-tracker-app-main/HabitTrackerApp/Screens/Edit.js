import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, Pressable, Switch, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { editHabit } from '../api';
import { AuthContext } from './AuthContext';
import { useNavigation, useRoute } from "@react-navigation/native";

const Edit = () => {
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { habit: habitParam } = route.params;
  const habit = habitParam ? JSON.parse(habitParam) : null;

  const [title, setTitle] = useState(habit?.title || "");
  const [selectedColor, setSelectedColor] = useState(habit?.color || "#FFD700");
  const [repeatMode, setRepeatMode] = useState(habit?.repeatMode || "Everyday");
  const [timeOfDay, setTimeOfDay] = useState(habit?.timeOfDay || "Anytime");
  const [reminder, setReminder] = useState(habit?.reminder || false);
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime ? new Date(habit.reminderTime) : new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const toggleReminder = () => {
    setReminder(!reminder);
    if (!reminder) setShowTimePicker(true);
  };

  const onTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || reminderTime;
    setShowTimePicker(Platform.OS === 'ios');
    setReminderTime(currentDate);
  };

  const updateHabit = async () => {
    if (!habit?._id || !title) {
      Alert.alert("Error", "Habit ID or title is missing.");
      return;
    }

    const updatedHabit = {
      title,
      color: selectedColor,
      repeatMode,
      timeOfDay,
      reminder,
      reminderTime: reminder ? reminderTime.toISOString() : null,
    };

    try {
      await editHabit(token, habit._id, updatedHabit);
      Alert.alert("Success", "Habit updated successfully");
      navigation.navigate("Tracker", { refresh: true });
    } catch (error) {
      console.error("Error updating habit:", error);
      Alert.alert("Error", "Could not update habit");
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} style={styles.backIcon} />
      <Text style={styles.header}>Edit Habit</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="Habit name"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Color</Text>
      <View style={styles.colorContainer}>
        {["#FFD700", "#1877F2", "#ff8c00", "#32CD32", "#de09cc", "#eb4034"].map((item, index) => (
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
      <Pressable onPress={updateHabit} style={styles.saveButton}>
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

export default Edit;
