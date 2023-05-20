import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import * as Location from "expo-location";
// import { Geocoder } from 'react-native-geocoding';

import Geocoder from "react-native-geocoding";

import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../../backend/firebase/firebase_config";
import Backend_Data from "../../../backend/firebase/backend_data";
const auth = getAuth(firebase);
const firestore = getFirestore(firebase);

const Home_Page = () => {
  const navigation = useNavigation();
  console.log("HomeScreen");
  const professions = [
    "All",
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

  const [selectedProfession, setSelectedProfession] = useState("");
  const [showUser, setShowUser] = useState(false);
  const [loggedinId, setLoggedinId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [user, setUser] = useState(null);
  const [postText, setPostText] = useState("");
  const [location, setLocation] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Distance in kilometers
  };

  const handleLocationClick = async () => {
    if (location) {
      const { latitude, longitude } = location.coords;

      try {
        const usersQuery = query(collection(firestore, "users"));
        const querySnapshot = await getDocs(usersQuery);
        const users = querySnapshot.docs.map((doc) => doc.data());

        // Filter users within a 10km radius
        const nearbyUsers = users.filter((user) => {
          console.log("User:", user);
          console.log("User latitude:", latitude);
          console.log("User longitude:", longitude);
          console.log("Other user latitude:", user.userlocation.coords.latitude);
          console.log("Other user longitude:", user.userlocation.coords.longitude);

          const distance = calculateDistance(
            latitude,
            longitude,
            user.userlocation.coords.latitude,  
            user.userlocation.coords.longitude

          );
          console.log("distance", distance);
          return distance <= 100; // Check if the distance is less than or equal to 10km
        });
         
        console.log("nearbyUsers", nearbyUsers);
        setNearbyUsers(nearbyUsers);
      } catch (error) {
        console.error("Error fetching nearby users:", error);
      }
    }
  };

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    console.log("in getLocationAsync and location is", location);
    if (location === null || location === undefined) {
      console.log("in if condition location is", location);
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

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setLoggedinId(user.uid);

      console.log("user is signed in", user.uid);
      const usersRef = collection(firestore, "users");
      const queryRef = query(usersRef, where("userId", "==", user.uid));
      console.log("queryRef", queryRef);
      getDocs(queryRef)
        .then((querySnapshot) => {
          if (querySnapshot.docs.length === 1) {
            console.log(
              "current logged in user's collection data",
              querySnapshot.docs[0].data()
            );
            setUser(querySnapshot.docs[0].id);
          } else {
            console.error(
              "Error getting user data: no matching documents found"
            );
            setUser(null);
          }
        })
        .catch((error) => {
          console.error("Error getting user data:", error);
          setUser(null);
        });
    } else {
      console.log("user is not signed in");
      setUser(null);
    }
  }, []);

  const handleSearchInput = (searchInput) => {
    setSelectedProfession(searchInput);
    setShowUser(true);
  };

  const handleViewjob = async () => {
    try {
      const postsQuery = query(collection(firestore, "posts"));
      const querySnapshot = await getDocs(postsQuery);
      const posts = querySnapshot.docs.map((doc) => doc.data());
      console.log("posts: ", posts);
      navigation.navigate("Posts", { posts: posts });
    } catch (e) {
      console.error("Error fetching posts: ", e);
    }
  };

  const handleProfileButtonClick = () => {
    alert("Profile Button Clicked");
  };

  const handleProfessionFilter = () => {
    alert("Profession Filter Clicked");
  };

  const handleMenuButtonClick = () => {
    alert("Menu Button Clicked");
  };

  const handlePostButtonClick = async () => {
    if (!user) {
      alert("Please sign in to post");
      return;
    }

    try {
      let phoneNumber = "";
      console.log(" checking user", user);
      const Ref = doc(firestore, "users", user);
      const docSnap = await getDoc(Ref);
      const userData = docSnap.data();
      console.log("user data", userData);
      let fullName = "";

      if (!userData) {
        alert("Please sign in to post");
        return;
      }

      phoneNumber = userData.phoneNumber;
      fullName = userData.fullName;
      console.log("phone number", phoneNumber);
      const post = {
        user: user,
        text: postText,
        date: new Date(),
        phoneNumber: phoneNumber,
        fullName: fullName,
      };
      if (postText.length !== 0) {
        const docRef = await addDoc(collection(firestore, "posts"), post);
        console.log("posted", postText);
        console.log("user", user);
        console.log("phone", phoneNumber);
        console.log("Document written with ID: ", docRef.id);
        setPostText("");
      } else {
        Alert.alert("Please enter a post");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handlePostText = (text) => {
    setPostText(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMenuButtonClick}
        >
          <Ionicons name="menu-outline" size={50} color="black" />
        </TouchableOpacity>
        <TextInput
          placeholder="Post a requirement"
          style={styles.inputField}
          onChangeText={setPostText}
          value={postText}
        />
        <TouchableOpacity
          style={styles.postButton}
          onPress={handlePostButtonClick}
        >
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header2}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="black" />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            onChangeText={handleSearchInput}
          />
        </View>
        <TouchableOpacity onPress={handleLocationClick}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={24} color="black" />
            <Text style={styles.locationText}>kerala</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfileButtonClick}
        >
          <Ionicons name="person-circle-outline" size={45} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            auth.signOut().then(() => {
              console.log("User logged out");
              setUser(null);
              navigation.navigate("Login_Page");
            });
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Body of the home screen */}
      <View style={styles.professionFilter}>
        <View style={styles.dropdownButtonContainer}>
          <SelectDropdown
            data={professions}
            onSelect={(selectedItem, index) => {
              setSelectedProfession(selectedItem);
              setShowUser(true);
            }}
            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            rowTextForSelection={(item, index) => item}
            dropdownStyle={styles.dropdown}
          />
          <TouchableOpacity style={styles.button} onPress={handleViewjob}>
            <Text style={styles.buttonText}>View Jobs</Text>
          </TouchableOpacity>
        </View>
        {showUser ? (
          selectedProfession !== "All" ? (
            <Backend_Data
              profession={selectedProfession}
              uid={loggedinId}
              nearbyUsers={nearbyUsers}
            />
          ) : (
            <Backend_Data uid={loggedinId} nearbyUsers={nearbyUsers} />
          )
        ) : (
          <Backend_Data
            profession=""
            uid={loggedinId}
            nearbyUsers={nearbyUsers}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // buttonContainer: {
  //   position: 'absolute',
  //   bottom: 0,
  //   alignSelf: 'center',
  //   marginBottom: 5,
  // },
  // button: {
  //   backgroundColor: '#007AFF',
  //   borderRadius: 50,
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,

  // },
  // buttonText: {
  //   color: 'white',
  //   fontSize: 12,
  //   fontWeight: 'bold',
  // },
  container: {
    flex: 1,
    display: "flex",
    position: "relative",
    backgroundColor: "#fff",
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  header2: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  menuButton: {
    marginLeft: 0,
  },
  fullScreen: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
  professionFilter: {
    right: 5,
    padding: 10,
    marginBottom: 10,
    borderRadius: 30,
    overflow: "hidden",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEEF9",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    marginRight: 10,
    height: 40, // added height
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16, // added font size
  },
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEEF9",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 15,
    height: 40, // added height
  },
  locationText: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  profileButton: {
    marginRight: 10, // added margin right
  },
  inputField: {
    backgroundColor: "#EFEEF9",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    height: 40, // added height
  },
  postButton: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center", // added align items
    justifyContent: "center", // added justify content
    width: 70, // added width
    height: 30, // added height
  },
  postText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  dropdown: {
    maxHeight: 200,
  },

  professionFilter: {
    padding: 10,
    backgroundColor: "#fff",
  },
  dropdownButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#3f51b5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home_Page;
