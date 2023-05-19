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

import { useNavigation } from "@react-navigation/native";

import Backend_Data from "../../../backend/firebase/backend_data";

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

  const [searchInput, setSearchInput] = useState("");

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
        }}
        buttonTextAfterSelection={(selectedItem, index) => selectedItem}
        rowTextForSelection={(item, index) => item}
        dropdownStyle={styles.dropdown}
      />
        </View> 
     </View>
      <Backend_Data />
    </View>
    </View>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    position: "relative",
    backgroundColor: "#fff",
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
  profileButton: {
    marginRight: 10, // added margin right
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

  professionFilter: {
    padding: 10,
    backgroundColor: "#fff",
  },

});

export default Home_Page;
