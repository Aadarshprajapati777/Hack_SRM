import React, { useState, useEffect } from "react";
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
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../../backend/firebase/firebase_config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";

const firebaseStore = getFirestore(firebase);
const auth = getAuth(firebase);
const storage = getStorage(firebase);

const professions = [
  "Select Your Profession",
  "Ambulance Driver",
  "Doctor",
  "Nurse",
  "Pharmacist",
  "Police",
  "web Developer",
  "software Engineer",
  "security Guard",
  "Others",
];

const Signup_Page = () => {
  const navigation = useNavigation();

  const [data, setData] = useState({
    fullName: "",
    address: "",
    contactNumber: "",
    password: "",
    profession: "",
    email: "",
    profilePicture: "",
    userlocation: null,
  });
  const [image, setImage] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    fullName,
    address,
    contactNumber,
    password,
    profession,
    email,
    userlocation,
  } = data;

  const handleRegistrationFormInputChange = (inputName, inputValue) => {
    const updatedFormState = { ...data };
    updatedFormState[inputName] = inputValue;
    setData(updatedFormState);
  };

  // useEffect(() => {
  //   getLocationAsync();
  // }, []);

  const getLocationAsync = async () => {
    if (location === null || location === undefined) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log("location", location);
    }
  };

  const handleLoginButtonPress = () => {
    navigation.navigate("Login_Page");
  };
  const handleRegisterFormSubmit = async () => {
    if (
      fullName &&
      address &&
      contactNumber &&
      profession &&
      password &&
      email &&
      image.uri &&
      location
    ) {
      try {
        // Show the activity indicator
        setLoading(true);

        const response = await fetch(image.uri);
        const blob = await response.blob();

        console.log("blob", blob);

        const imageRef = ref(storage, `uploads/images/${new Date().getTime()}`);
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        console.log("Image uploaded successfully! URL: ", downloadURL);

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("User registered successfully!");
        const docRef = await addDoc(collection(firebaseStore, "users"), {
          fullName: fullName,
          address: address,
          phoneNumber: contactNumber,
          password: password,
          profession: profession,
          email: email,
          imageUrl: imageRef.fullPath,
          userId: user.uid,
          userlocation: location,
        });
        console.log("Document written with ID: ", docRef.id);
        navigation.navigate("Login_Page");
      } catch (error) {
        console.error("Error registering user: ", error);
        Alert.alert("Error registering user");
      } finally {
        // Hide the activity indicator
        setLoading(false);
      }
    } else {
      console.error("Please fill all the fields");
      Alert.alert("Please fill all the fields");
    }
  };

  const handleUploadImage = async () => {
    try {
      const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!imagePickerResult.canceled) {
        setImage(imagePickerResult);
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const handleLocationClick = () => {
    getLocationAsync();
  };

  if (location) {
    const { latitude, longitude } = location.coords;
    Geocoder.from(latitude, longitude)
      .then((response) => {
        const address = response.results[0].formatted_address;
        // Store the selected location and perform further actions
        // E.g., send the location to a backend API, retrieve data, etc.
        console.log("Selected Location:", address);
        // Navigate to the screen showing registered users within 10km radius
        navigation.navigate("UsersScreen", { latitude, longitude });
      })
      .catch((error) => console.warn(error));
  }

  const { width } = useWindowDimensions();
  const formStyle = width >= 768 ? styles.formLarge : styles.formSmall;

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={[formStyle, styles.form]}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          onChangeText={(text) =>
            handleRegistrationFormInputChange("fullName", text)
          }
          value={fullName}
        />
        <TextInput
          style={styles.input}
          styles={styles.form}
          placeholder="Address"
          onChangeText={(text) =>
            handleRegistrationFormInputChange("address", text)
          }
          value={address}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          onChangeText={(text) =>
            handleRegistrationFormInputChange("contactNumber", text)
          }
          value={contactNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) =>
            handleRegistrationFormInputChange("email", text)
          }
          value={email}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) =>
            handleRegistrationFormInputChange("password", text)
          }
          value={password}
          secureTextEntry={true}
        />

        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={profession}
            onValueChange={(itemValue, itemIndex) =>
              handleRegistrationFormInputChange("profession", itemValue)
            }
          >
            {professions.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadImage}
        >
          <Text style={styles.uploadButtonText}>upload photo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLocationClick}>
          <View
            style={{
              width: 300,
              height: 50,
              borderRadius: 25,
              backgroundColor: "lightblue",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
              marginBottom: 15,
            }}
          >
            <Ionicons name="location-sharp" size={24} color="black" />
            <Text style={styles.locationText}>Please tap on location icon</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegisterFormSubmit}
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
};

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
  locationText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0077FF",
    textAlign: "center",
  },
});

export default Signup_Page;
