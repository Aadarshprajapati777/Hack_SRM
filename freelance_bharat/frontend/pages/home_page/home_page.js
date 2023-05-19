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
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
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

  const handleSearchInput = (text) => {
    setSearchInput(text);
  };

  const handleLocationClick = () => {
    alert("Location Clicked");
  };

  const handleProfileButtonClick = () => {
    alert("Profile Button Clicked");
  };

  const handleProfessionFilter = () => {
    alert("Profession Filter Clicked");
  };

  return (
    <View style={styles.container}>
      <Text>This is home page</Text>

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

            {showUser ? (
              selectedProfession !== "All" ? (
                <Backend_Data profession={selectedProfession} uid={loggedinId} />
              ) : (
                <Backend_Data uid={loggedinId} />
              )
            ) : (
              <Backend_Data profession="" uid={loggedinId} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home_Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    position: "relative",
    backgroundColor: "#fff",
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
});
