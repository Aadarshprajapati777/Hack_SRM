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
import { firebase } from "../../../backend/firebase/firebase_config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

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
  });

  const { fullName, address, contactNumber, password, profession, email } =
    data;

  const handleRegistrationFormInputChange = (inputName, inputValue) => {
    const updatedFormState = { ...data };
    updatedFormState[inputName] = inputValue;
    setData(updatedFormState);
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
      email
    ) {
      try {
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
          userId: user.uid,
        });
        console.log("Document written with ID: ", docRef.id);
        navigation.navigate("Login_Page");
      } catch (error) {
        console.error("Error registering user: ", error);
      }
    } else {
      console.error("Please fill all the field");
    }
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
          placeholder="Password"
          onChangeText={(text) =>
            handleRegistrationFormInputChange("password", text)
          }
          value={password}
          secureTextEntry={true}
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
