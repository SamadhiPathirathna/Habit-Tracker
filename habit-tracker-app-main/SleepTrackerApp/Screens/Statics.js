import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, Text, StyleSheet, View, Dimensions } from 'react-native';
import { ProgressChart, BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from './AuthContext';

const HabitStatisticsScreen = () => {
  const { token } = useContext(AuthContext);
  const [statistics, setStatistics] = useState(null);
  

  const isFocused = useIsFocused();

  const fetchHabitStatistics = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://192.168.157.31:8070/habit/statistics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Error fetching habit statistics:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchHabitStatistics();
    }
  }, [isFocused, token]);

  // Handle cases where statistics are not yet available
  if (!statistics) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Calculate the updated completion rate based on available data
  
const totalHabits = (statistics.completedHabits || 0) + (statistics.pendingHabits || 0) + (statistics.skippedHabits || 0);
const completionRate = totalHabits > 0 ? statistics.completedHabits / totalHabits : 0;


  const progressChartData = {
    data: [completionRate, 1 - completionRate],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Habit Statistics</Text>

      {/* Section for completed, pending, and skipped statistics in two rows */}
      <View style={styles.section}>
        <View style={styles.habitStatsContainer}>
          <View style={[styles.habitStatBox, { backgroundColor: '#4CAF50' }]}>
            <Text style={styles.habitStatLabel}>Completed</Text>
            <Text style={styles.habitStatValue}>{statistics.completedHabits}</Text>
          </View>
          <View style={[styles.habitStatBox, { backgroundColor: '#FF6F61' }]}>
            <Text style={styles.habitStatLabel}>Pending</Text>
            <Text style={styles.habitStatValue}>{statistics.pendingHabits}</Text>
          </View>
        </View>
        <View style={styles.habitStatsContainer}>
          <View style={[styles.habitStatBox, { backgroundColor: '#FFD700' }]}>
            <Text style={styles.habitStatLabel}>Skipped</Text>
            <Text style={styles.habitStatValue}>{statistics.skippedHabits}</Text>
          </View>
          <View style={[styles.habitStatBox, { backgroundColor: '#1E90FF' }]}>
            <Text style={styles.habitStatLabel}>Completion Rate</Text>
            <Text style={styles.habitStatValue}>{Math.round(completionRate * 100)}%</Text>
          </View>
        </View>
      </View>

      {/* Most Completed and Most Skipped Habits */}
      <View style={styles.specialStatsSection}>
        <Text style={styles.specialStatsTitle}>Most Completed Habit</Text>
        <Text style={styles.specialStatsValue}>{statistics.mostCompletedHabit || "N/A"}</Text>

        <Text style={styles.specialStatsTitle}>Most Skipped Habit</Text>
        <Text style={styles.specialStatsValue}>{statistics.mostSkippedHabit || "N/A"}</Text>
      </View>

      {/* Progress chart for today's progress */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Today's Progress</Text>
        <ProgressChart
          data={progressChartData}
          width={Dimensions.get("window").width - 40}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1, index) =>
              index === 0 ? `rgba(76, 175, 80, ${opacity})` : `rgba(255, 111, 97, ${opacity})`,
          }}
          hideLegend={false}
        />
      </View>

      {/* Weekly Progress Bar Chart for Completed, Skipped, and Incomplete */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Weekly Progress</Text>
        <BarChart
          data={{
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            datasets: [
              {
                data: statistics.weeklyCompletedHabits,
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green for completed
              },
              {
                data: statistics.weeklySkippedHabits,
                color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`, // Yellow for skipped
              },
              {
                data: statistics.weeklyIncompleteHabits,
                color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red for incomplete
              },
            ],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          showValuesOnTopOfBars
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f8ff', padding: 20 },
  header: { fontSize: 32, fontWeight: "bold", color: '#1e90ff', textAlign: "center", marginBottom: 20 },
  section: { marginBottom: 20 },
  habitStatsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  habitStatBox: { flex: 1, borderRadius: 10, padding: 20, alignItems: "center", justifyContent: "center", marginHorizontal: 5 },
  habitStatLabel: { fontSize: 14, color: '#fff' },
  habitStatValue: { fontSize: 28, fontWeight: "bold", color: '#fff' },
  specialStatsSection: { marginVertical: 20, backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10 },
  specialStatsTitle: { fontSize: 18, fontWeight: "bold", color: '#2c3e50', marginBottom: 5 },
  specialStatsValue: { fontSize: 20, color: '#333', marginBottom: 15 },
  chartSection: { marginVertical: 20, backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  chartTitle: { fontSize: 18, fontWeight: "bold", color: '#2c3e50', marginBottom: 10 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#888' },
});

export default HabitStatisticsScreen;
