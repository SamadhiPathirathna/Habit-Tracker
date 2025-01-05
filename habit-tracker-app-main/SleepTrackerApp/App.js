// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Buttons from './Screens/Buttons';
import Tracker from './Screens/Tracker';
import SettingsScreen from './Screens/Personalize';
import ProfileScreen from './Screens/Profile';
import HabitStatisticsScreen from './Screens/Statics';
import HabitWelcome from './Screens/HabitWelcome';
import CreateProfile from './Screens/CreateProfile';
import LoginScreen from './Screens/LoginScreen';
import Create from './Screens/Create';
import Edit from './Screens/Edit';
import { AuthProvider } from './Screens/AuthContext';

// Stack and Tab Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Tracker') iconName = 'checkmark-circle';
          else if (route.name === 'Personalize') iconName = 'brush';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Statistics') iconName = 'stats-chart';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Tracker" component={Tracker} />
      <Tab.Screen name="Personalize" component={SettingsScreen} />
      <Tab.Screen name="Statistics" component={HabitStatisticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="CreateProfile" component={CreateProfile} options={{ title: 'Create Profile' }} />
          <Stack.Screen name="Home" component={CreateProfile} options={{ title: 'Home' }} />
          <Stack.Screen name="Buttons" component={Buttons} options={{ title: 'Options' }} />
          <Stack.Screen name="HabitWelcome" component={HabitWelcome} options={{ title: 'Welcome' }} />
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Create" component={Create} options={{ title: 'Create Habit' }} />
          <Stack.Screen name="Edit" component={Edit} options={{ title: 'Edit Habit' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
