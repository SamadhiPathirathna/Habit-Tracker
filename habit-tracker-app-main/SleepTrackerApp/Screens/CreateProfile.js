import React, { useState, useContext } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from './AuthContext';
import DropDownPicker from 'react-native-dropdown-picker';

const CreateProfile = ({ navigation }) => {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    lifestyle: '',
  });

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'School Student', value: 'School Student' },
    { label: 'Uni Student', value: 'Uni Student' },
    { label: 'Worker', value: 'Worker' },
    { label: 'Content Creator', value: 'Content Creator' },
    { label: 'Freelancer', value: 'Freelancer' },
    { label: 'Housewife', value: 'Housewife' },
    { label: 'Other', value: 'Other' },
  ]);

  const handleRegister = async () => {
    // Simple validation check
    const { username, password, name, age, gender, lifestyle } = formData;
    if (!username || !password || !name || !age || !gender || !lifestyle) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      await registerUser(formData);
      Alert.alert('Success', 'Profile created');
      navigation.navigate('LoginScreen');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Could not create profile';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Profile</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
        value={formData.username}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        value={formData.password}
      />
      <TextInput
        placeholder="Name"
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        value={formData.name}
      />
      <TextInput
        placeholder="Age"
        keyboardType="number-pad"
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, age: text })}
        value={formData.age}
      />
      <TextInput
        placeholder="Gender"
        style={styles.input}
        onChangeText={(text) => setFormData({ ...formData, gender: text })}
        value={formData.gender}
      />

      <DropDownPicker
        open={open}
        value={formData.lifestyle}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => setFormData({ ...formData, lifestyle: callback() })}
        setItems={setItems}
        placeholder="Select Lifestyle"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#5c6bc0',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdown: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  button: {
    backgroundColor: '#5c6bc0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateProfile;
