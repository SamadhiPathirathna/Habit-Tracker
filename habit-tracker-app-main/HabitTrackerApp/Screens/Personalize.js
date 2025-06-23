import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext';
import { fetchRecommendations } from '../api';

const SettingsScreen = () => {
  const { token } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        const response = await fetchRecommendations(token);
        setRecommendations(response.data.recommended_habits);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
    getRecommendations();
  }, [token]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>JOURNEY</Text>
      <Text style={styles.sectionHeader}>Recommended for You</Text>
      {recommendations.length > 0 ? (
        <View style={styles.recommendationsContainer}>
          {recommendations.map((rec, index) => (
            <View key={index} style={[styles.recommendCard, { backgroundColor: index % 2 === 0 ? '#6a8caf' : '#ffa751' }]}>
              <View style={styles.textContainer}>
                <Text style={styles.journeyTitle}>{rec.habit}</Text>
                <Text style={styles.probability}>Confidence: {Math.round(rec.probability * 100)}%</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noRecommendations}>No recommendations available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 20 },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#34495e', textAlign: 'center' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#7f8c8d', textAlign: 'center' },
  recommendationsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  recommendCard: { 
    width: '48%', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15, 
    justifyContent: 'center', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  textContainer: { alignItems: 'center' },
  journeyTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  probability: { fontSize: 14, color: '#ecf0f1', marginTop: 8 },
  noRecommendations: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginTop: 20 },
});

export default SettingsScreen;
