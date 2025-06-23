import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Buttons from "./Buttons";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});
    const [loginSuccess, setLoginSuccess] = useState(false);
  
    const validateForm = () => {
      let errors = {};
      if (!username) {
        errors.username = "Username is required";
      }
      setErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
    const handleLogin = () => {
        if (validateForm()) {
          setLoginSuccess(true);
          navigation.navigate('Buttons'); // Navigate on successful login
        }
      };
      
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.container}
      >
        <Text style={styles.text}>Welcome</Text>
        {!loginSuccess ? (
          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
            <View style={styles.actionButtonGroup}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLogin}>
                <Text style={styles.actionButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.successText}>
              {username} logged in successfully!
            </Text>
            <Buttons />
          </View>
        )}
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    );
  }
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",  // Brighter background for better contrast
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#2F4F4F",  // Dark slate gray for a sophisticated look
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 20,
    width: screenWidth - 70,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#696969",  // Dim gray for labels
  },
  input: {
    height: 50, // Increased height for better touch area
    borderColor: "#708090", // Slate gray border
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,  // Increased horizontal padding
    borderRadius: 8,
    fontSize: 18, // Larger font size
    textAlign: 'center',
    backgroundColor: "#F0F8FF", // Alice blue for input background to distinguish area
  },
  errorText: {
    color: "#B22222", // Firebrick red for error messages
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: "#32CD32", // Lime green for success messages
    padding: 20,
  },
  actionButtonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: "#4682B4", // Steel blue for button background
    padding: 12,
    width: screenWidth - 250,
    alignItems: 'center',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 18,
    color: "#ffffff", // White text for better readability
  },
});

