import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
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
import Slider from "@react-native-community/slider";

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
  const [islocationclicked, setIslocationclicked] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

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
    return { distance, userLocation: { lat: lat2, lon: lon2 } };
  };

  const handleLocationClick = async () => {
    setIsVisible(true);

    if (location) {
      const { latitude, longitude } = location.coords;

      try {
        const usersQuery = query(collection(firestore, "users"));
        const querySnapshot = await getDocs(usersQuery);
        const users = querySnapshot.docs.map((doc) => doc.data());

        const nearbyUsers = users
          .map((user) => {
            const distanceObj = calculateDistance(
              latitude,
              longitude,
              user.userlocation.coords.latitude,
              user.userlocation.coords.longitude
            );
            return { ...user, ...distanceObj };
          })
          .filter((user) => user.distance <= sliderValue);

        console.log("nearbyUsers", nearbyUsers);
        setNearbyUsers(nearbyUsers);
        setIslocationclicked(true);
      } catch (error) {
        console.error("Error fetching nearby users:", error);
      }
    }
  };

  useEffect(() => {
    getLocationAsync();
  }, []);

  useEffect(() => {
    let timer;
    if (islocationclicked) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Change the timeout value (in milliseconds) to the desired duration
    }

    return () => clearTimeout(timer);
  }, [islocationclicked, Date.now()]); // Add Date.now() as a dependency

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
  console.log("distance", sliderValue);

  const handleSliderValueChange = (value) => {
    const roundedValue = value.toFixed(0);
    setSliderValue(parseFloat(roundedValue));
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
      const post = {
        user: user,
        text: postText,
        date: new Date(),
        phoneNumber: phoneNumber,
        fullName: fullName,
      };
      if (postText.length !== 0) {
        const docRef = await addDoc(collection(firestore, "posts"), post);
        console.log("Document written with ID: ", docRef.id);
        setPostText("");
      } else {
        Alert.alert("Please enter a post");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMenuButtonClick}
        >
          <Ionicons name="person-circle-outline" size={35} color="black" />
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
            {islocationclicked ? (
              <View>
                {isVisible ? (
                  <Slider
                    style={{ width: 70, height: 40 }}
                    minimumValue={0}
                    maximumValue={120}
                    minimumTrackTintColor="#000000"
                    maximumTrackTintColor="#FFFFFF"
                    onValueChange={handleSliderValueChange}
                  />
                ) : (
                  <Ionicons name="location-sharp" size={24} color="black" />
                )}
              </View>
            ) : (
              <Ionicons name="location-sharp" size={24} color="black" />
            )}
            {islocationclicked ? (
              <Text style={styles.slidervalue}>{sliderValue}</Text>
            ) : (
              <Text style={styles.locationText}>Nearby</Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            auth.signOut().then(() => {
              console.log("User logged out");
              setUser(null);
              setIslocationclicked(false);
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
              navigation={navigation}
              nearbyUsers={nearbyUsers}
              islocationclicked={islocationclicked}
            />
          ) : (
            <Backend_Data
              navigation={navigation}
              nearbyUsers={nearbyUsers}
              islocationclicked={islocationclicked}
            />
          )
        ) : (
          <Backend_Data
            navigation={navigation}
            nearbyUsers={nearbyUsers}
            islocationclicked={islocationclicked}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  menuButton: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  postText: {
    color: "white",
    fontWeight: "bold",
  },
  header2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    elevation: 2,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    marginLeft: 5,
  },
  slidervalue: {
    fontSize: 16,
    marginLeft: 5,
  },
  logoutButton: {
    marginLeft: 10,
  },
  logoutText: {
    color: "#1976D2",
    fontWeight: "bold",
  },
  professionFilter: {
    flex: 1,
    padding: 10,
  },
  dropdownButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dropdown: {
    marginTop: 40,
  },
  button: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Home_Page;
