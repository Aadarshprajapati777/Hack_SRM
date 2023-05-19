import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import { Linking } from "react-native";

const UserProfile = ({ route }) => {
  const { state } = route.params;
  const { name, profile_image , address, ratings, contact, profession} = state;

  const handCallClick = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessageClick = (phoneNumber) => {
    const messageUrl = `sms:${phoneNumber}`;
    Linking.openURL(messageUrl);
  };


  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="star" size={24} color="#5B5B5B" />
          <Text style={styles.ratings}>{ratings}</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="report" size={24} color="#5B5B5B" />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: profile_image }} />
      </View>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handCallClick(contact)}>
          <MaterialIcons name="call" size={24} color="#5B5B5B" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMessageClick(contact)}>
          <MaterialIcons name="message" size={24} color="#5B5B5B" />
        </TouchableOpacity>
      </View>
        <Text style={styles.profession}>{profession}</Text>
      <Text style={styles.address}>{address}</Text>
      <View style={styles.postsContainer}>
        {/*  user's posts here */}

        <Text>Posts</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 60,
    borderColor: "#5B5B5B",
    borderWidth: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "40%",
    marginBottom: 20,
  },
  address: {
    fontSize: 16,
    color: "#5B5B5B",
    marginBottom: 5,
  },
  ratings: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5,
  },
  postsContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
    profession: {
    fontSize: 19,
    color: "#5B5B5B",
    marginBottom: 5,
    },

});

export default UserProfile;
