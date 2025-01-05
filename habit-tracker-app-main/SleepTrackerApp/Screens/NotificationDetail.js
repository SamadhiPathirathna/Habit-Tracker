import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const NotificationDetail = ({ route, navigation }) => {
  const { notification, onUpdateNotification } = route.params;
  const [time, setTime] = useState(notification.time);
  const [repeat, setRepeat] = useState(notification.repeat);
  const [isEnabled, setIsEnabled] = useState(notification.isEnabled);
  const [showPicker, setShowPicker] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes() < 10 ? '0' : ''}${currentDate.getMinutes()}`;
    setShowPicker(false);
    setTime(formattedTime);
  };

  const saveNotification = () => {
    const updatedNotification = {
      ...notification,
      time,
      repeat,
      isEnabled,
    };
    onUpdateNotification(updatedNotification); // Pass the updated notification back
    navigation.goBack(); // Navigate back to the NotificationList
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>{notification.title}</Text>

      {/* Time Setting */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Time</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text style={{ fontSize: 18, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
            {time}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>

      {/* Repeat Setting */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Repeat</Text>
        <TouchableOpacity onPress={() => setRepeat(repeat === 'Everyday' ? 'Never' : 'Everyday')}>
          <Text style={{ fontSize: 18, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>{repeat}</Text>
        </TouchableOpacity>
      </View>

      {/* Enabled Setting */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Enabled</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <Button title="Save" onPress={saveNotification} />
    </View>
  );
};

export default NotificationDetail;
