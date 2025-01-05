import React, { useState, useEffect, useRef, useContext, memo } from "react";
import { Text, View, Pressable, FlatList, Alert, StyleSheet, ScrollView, Modal } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import axios from "axios";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from './AuthContext';

const generateMonthDates = () => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i);
    dates.push({
      day: date.toLocaleString('default', { weekday: 'short' }),
      date: i,
      fullDate: date,
    });
  }
  return dates;
};

const DateItem = memo(({ item, selectedDate, onSelect }) => (
  <Pressable
    onPress={() => onSelect(item.fullDate)}
    style={[
      styles.dateContainer,
      {
        borderColor: selectedDate.getDate() === item.date ? '#0071c5' : '#ccc',
        backgroundColor: selectedDate.getDate() === item.date ? '#0071c5' : 'transparent',
      }
    ]}
  >
    <Text style={{ color: selectedDate.getDate() === item.date ? 'white' : 'black', fontSize: 12 }}>
      {item.day}
    </Text>
    <Text style={{ color: selectedDate.getDate() === item.date ? 'white' : 'black', fontSize: 12 }}>
      {item.date}
    </Text>
  </Pressable>
));

const Tracker = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { token } = useContext(AuthContext);
  const [habits, setHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [option, setOption] = useState("Anytime");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (isFocused) {
      fetchHabits();
    }
  }, [isFocused]);

  useEffect(() => {
    const todayIndex = generateMonthDates().findIndex(
      (item) => item.date === new Date().getDate()
    );
    if (flatListRef.current && todayIndex >= 0) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: todayIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }, 100);
    }
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get("http://192.168.157.31:8070/habit/gethabits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(Array.isArray(response.data) ? response.data : []);
      console.log("Fetched habits:", response.data);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const handleStatusChange = async (habit, status) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    try {
      const response = await axios.put(
        `http://192.168.157.31:8070/habit/status/${habit._id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        console.log(`Habit ${habit._id} marked as ${status} on ${formattedDate}`);
        await fetchHabits(); // Refresh habits to ensure accurate display
        setModalVisible(false);
      } else {
        console.error(`Failed to update habit ${habit._id} as ${status}`);
      }
    } catch (error) {
      console.error("Error updating habit status:", error);
    }
  };

  const toggleHabitCompletion = async (habit) => {
    await handleStatusChange(habit, "completed");
  };

  const editHabit = (habit) => {
    navigation.navigate('Edit', { habit: JSON.stringify(habit) });
    setModalVisible(false);
  };

  const deleteHabit = async (habitId) => {
    try {
      await axios.delete(`http://192.168.157.31:8070/habit/deletehabit/${habitId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHabits();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete habit.');
    }
  };

  const openOptions = (habit) => {
    setSelectedHabit(habit);
    setModalVisible(true);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Ionicons name="logo-foursquare" size={27} color="black" />
          <Pressable onPress={() => navigation.navigate('Create')}>
            <Feather name="plus" size={24} color="black" />
          </Pressable>
        </View>
        <Text style={styles.title}>Today</Text>
        <FlatList
          horizontal
          ref={flatListRef}
          data={generateMonthDates()}
          renderItem={({ item }) => (
            <DateItem item={item} selectedDate={selectedDate} onSelect={setSelectedDate} />
          )}
          keyExtractor={(item) => item.date.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: 10 }}
          getItemLayout={(_, index) => ({ length: 60, offset: 60 * index, index })}
        />

        {/* Time Options for Habit Filtering */}
        <View style={styles.timeOptionsContainer}>
          {[
            { label: "Anytime", icon: "time-outline", bgColor: "#3B8E00", activeColor: "#2A6D00" },
            { label: "Morning", icon: "sunny-outline", bgColor: "#FFD600", activeColor: "#E5BC00" },
            { label: "Afternoon", icon: "cloud-outline", bgColor: "#FF9800", activeColor: "#E67A00" },
            { label: "Evening", icon: "moon-outline", bgColor: "#3F51B5", activeColor: "#303F9F" }
          ].map((time, index) => (
            <Pressable
              key={index}
              style={[
                styles.timeOption,
                { backgroundColor: option === time.label ? time.activeColor : time.bgColor }
              ]}
              onPress={() => setOption(time.label)}
            >
              <Ionicons name={time.icon} size={24} color="#fff" />
              <Text style={styles.timeOptionText}>{time.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.habitList}>
          {habits
            .filter(habit => habit.timeOfDay === option)
            .map((habit) => {
              const formattedDate = selectedDate.toISOString().split('T')[0];
              const isCompleted = habit.completed?.[formattedDate];
              const isSkipped = habit.skipped?.[formattedDate];

              return (
                <View key={habit._id} style={[styles.habitContainer, { backgroundColor: habit.color || "#FFD700" }]}>
                  <Pressable onPress={() => toggleHabitCompletion(habit)} style={styles.habitCheckBox}>
                    <Ionicons
                      name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
                      size={24}
                      color={isCompleted ? "#32CD32" : "#000"}
                    />
                  </Pressable>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.habitTitle}>{habit.title}</Text>
                    {isSkipped && (
                      <Ionicons name="pause-circle" size={20} color="#FFA500" style={{ marginLeft: 5 }} />
                    )}
                  </View>
                  <Pressable onPress={() => openOptions(habit)} style={{ marginLeft: 10 }}>
                    <Ionicons name="ellipsis-vertical" size={24} color="white" />
                  </Pressable>
                </View>
              );
            })}
        </View>

        {selectedHabit && (
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Options</Text>
                <Pressable style={styles.modalOption} onPress={() => handleStatusChange(selectedHabit, "skipped")}>
                  <Ionicons name="pause-circle-outline" size={20} color="orange" style={styles.modalIcon} />
                  <Text style={styles.modalOptionText}>Take a Day Off</Text>
                </Pressable>
                <Pressable style={styles.modalOption} onPress={() => editHabit(selectedHabit)}>
                  <Ionicons name="create-outline" size={20} color="blue" style={styles.modalIcon} />
                  <Text style={styles.modalOptionText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.modalOption} onPress={() => deleteHabit(selectedHabit._id)}>
                  <Ionicons name="trash-outline" size={20} color="red" style={styles.modalIcon} />
                  <Text style={styles.modalOptionText}>Delete</Text>
                </Pressable>
                <Pressable style={[styles.modalOption, styles.cancelOption]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelOptionText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 20 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 30, fontWeight: 'bold', color: '#000', marginVertical: 10 },
  dateContainer: { padding: 8, width: 60, height: 60, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  timeOptionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  timeOption: { paddingVertical: 10, paddingHorizontal: 5, borderRadius: 50, width: 86, justifyContent: 'center', alignItems: 'center' },
  timeOptionText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  habitList: { paddingVertical: 10 },
  habitContainer: { borderRadius: 12, padding: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  habitCheckBox: { marginRight: 10 },
  habitTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 8, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  modalIcon: { marginRight: 10 },
  modalOptionText: { fontSize: 16 },
  cancelOptionText: { fontSize: 16, color: 'red', textAlign: 'center' }
});

export default Tracker;
