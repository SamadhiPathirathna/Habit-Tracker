import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from './AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, loadUserData, updateUserProfile, logoutUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    name: user?.name || '',
    age: user?.age?.toString() || '',
    gender: user?.gender || '',
    lifestyle: user?.lifestyle || '',
  });

  const [openDropdown, setOpenDropdown] = useState(false);
  const [lifestyleItems] = useState([
    { label: 'School Student', value: 'School Student' },
    { label: 'Uni Student', value: 'Uni Student' },
    { label: 'Worker', value: 'Worker' },
    { label: 'Content Creator', value: 'Content Creator' },
    { label: 'Freelancer', value: 'Freelancer' },
    { label: 'Housewife', value: 'Housewife' },
    { label: 'Other', value: 'Other' },
  ]);

  useEffect(() => {
    if (!user) {
      loadUserData();
    } else {
      setFormData({
        username: user.username,
        name: user.name,
        age: user.age?.toString(),
        gender: user.gender,
        lifestyle: user.lifestyle,
      });
    }
  }, [user]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const success = await updateUserProfile(formData);
      if (success) {
        setIsEditing(false);
        Alert.alert("Profile Updated", "Your profile has been successfully updated.");
      } else {
        Alert.alert("Update Failed", "Could not update your profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Update Error", "An error occurred while updating your profile.");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{formData.username}</Text>
      </View>

      <View style={styles.detailContainer}>
        {isEditing ? (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#333" />
              <TextInput
                style={styles.input}
                value={formData.name}
                placeholder="Name"
                onChangeText={(value) => handleChange('name', value)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={24} color="#333" />
              <TextInput
                style={styles.input}
                value={formData.age}
                placeholder="Age"
                keyboardType="number-pad"
                onChangeText={(value) => handleChange('age', value)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="male-female-outline" size={24} color="#333" />
              <TextInput
                style={styles.input}
                value={formData.gender}
                placeholder="Gender"
                onChangeText={(value) => handleChange('gender', value)}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Ionicons name="bicycle-outline" size={24} color="#333" style={{ marginRight: 10 }} />
              <DropDownPicker
                open={openDropdown}
                value={formData.lifestyle}
                items={lifestyleItems}
                setOpen={setOpenDropdown}
                setValue={(value) => handleChange('lifestyle', value())}
                placeholder="Select Lifestyle"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownBox}
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={24} color="#333" />
              <Text style={styles.detailText}>Name: {user?.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={24} color="#333" />
              <Text style={styles.detailText}>Age: {user?.age}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="male-female-outline" size={24} color="#333" />
              <Text style={styles.detailText}>Gender: {user?.gender}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="bicycle-outline" size={24} color="#333" />
              <Text style={styles.detailText}>Lifestyle: {user?.lifestyle}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.optionItem} onPress={toggleEditMode}>
          <Ionicons name="create-outline" size={24} color="#333" />
          <Text style={styles.optionText}>{isEditing ? "Cancel" : "Edit Profile"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text style={[styles.optionText, { color: 'red' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#5c6bc0",
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  detailContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 50, // Increase margin for better dropdown visibility
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Increase space between inputs
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30, // More space to accommodate dropdown menu
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    flex: 1,
  },
  dropdown: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderWidth: 0,
    borderRadius: 8,
  },
  dropdownBox: {
    backgroundColor: "#f0f0f0",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Increase space for better layout
  },
  detailText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  optionContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginTop: 20, // Add more space above options
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#5c6bc0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30, // Additional margin to separate button
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ProfileScreen;
