import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SocketIO from "socket.io-client";





const Signup_Page = () => {


    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");



    const navigation = useNavigation();

    const handleLoginButtonPress = () => {
        navigation.navigate("Login_Page");
    };
    const handleRegisterButtonPress = () => {
        const socket = SocketIO("http://localhost:3000");
        socket.emit('signup', {
            fullName,
            address,
            contactNumber,
            password,
            email,
        });

        setFullName("");
        setAddress("");
        setContactNumber("");
        setPassword("");
        setEmail("");
    };

    const handleUploadImage = () => {
        alert("Upload Image");
    };


    const { width } = useWindowDimensions();
    const formStyle = width >= 768 ? styles.formLarge : styles.formSmall;


    
    return (
    <SafeAreaView style={styles.container}>
      <View style={[formStyle, styles.form]}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
        />
        <TextInput
          style={styles.input}
          styles={styles.form}
          placeholder="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}   
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={contactNumber}
          keyboardType="phone-pad"
            onChangeText={(text) => setContactNumber(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"

          value={password}
          secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}

        />
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadImage}
        >
          <Text style={styles.uploadButtonText}>upload photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegisterButtonPress}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleLoginButtonPress}>
            <Text style={styles.loginButton}>Login here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: "#CCD4FF    ",
      shadowColor: "#000", // Add shadow properties
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    form: {
      width: "100%",
      paddingHorizontal: 20,
      paddingBottom: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      marginBottom: 10,
      paddingLeft: 10,
      fontSize: 16,
    },
    professionText: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      marginBottom: 10,
    },
    picker: {
      height: 50,
      fontSize: 16,
    },
    button: {
      backgroundColor: "#0077FF",
      height: 40,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    uploadButton: {
      backgroundColor: "#0077FF",
      height: 40,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    uploadButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    registerButton: {
      backgroundColor: "#0077FF",
      height: 40,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    registerButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    loginSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    loginText: {
      fontSize: 14,
      marginRight: 5,
    },
    loginButton: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#0077FF",
    },
    imageContainer: {
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: "cover",
      borderRadius: 100,
    },

    });


export default Signup_Page;
