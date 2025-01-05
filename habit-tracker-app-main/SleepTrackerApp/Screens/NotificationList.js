import React, { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Sample notification data
const initialNotifications = [
  { id: '1', title: 'Global reminders', time: '22:30', repeat: 'Everyday', isEnabled: true },
  { id: '2', title: 'Habit of morning', time: '05:50', repeat: 'Everyday', isEnabled: true },
  { id: '3', title: 'Habit of afternoon', time: '14:20', repeat: 'Everyday', isEnabled: true },
  { id: '4', title: 'Habit of evening', time: '19:20', repeat: 'Everyday', isEnabled: true },
];

const NotificationList = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const navigation = useNavigation();

  const handlePress = (item) => {
    // Navigate to Notification Detail screen and pass the item data
    navigation.navigate('NotificationDetail', { 
      notification: item,
      onUpdateNotification: updateNotification
    });
  };

  const updateNotification = (updatedNotification) => {
    // Update the notification in the list
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === updatedNotification.id ? updatedNotification : notif
      )
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={{
              padding: 20,
              borderBottomWidth: 1,
              borderColor: '#ccc',
              marginBottom: 10,
              backgroundColor: '#fff',
            }}
            onPress={() => handlePress(item)}
          >
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>{item.time} - {item.repeat}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default NotificationList;
