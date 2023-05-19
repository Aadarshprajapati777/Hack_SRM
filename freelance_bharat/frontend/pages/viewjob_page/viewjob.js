import React from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Linking } from "react-native";

const Posts = ({ route, navigation }) => {

  console.log("in viewjobs");
  const { posts } = route.params;
  console.log("in viewjobs", posts);
  console.log("in viewjobs fullname", posts.fullName);
  phoneNumber = posts.phoneNumber;

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessage = (phoneNumber) => {
    const messageUrl = `sms:${phoneNumber}`;
    Linking.openURL(messageUrl);
  };

  const renderPostItem = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Text style={styles.userId}>{item.fullName}</Text>
          <Text style={styles.userId}>{item.profession}</Text>
        </View>
        <View style={styles.postBody}>
          <Text style={styles.postText}>{item.text}</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleCall(item.phoneNumber)}
            >
              <Icon name="call" style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleMessage(item.phoneNumber)}
            >
              <Icon name="message" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.userId}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#C7C6CE",
  },
  postContainer: {
    backgroundColor: "#f44336",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userId: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  postBody: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  postText: {
    color: "#f44336",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    backgroundColor: "#f44336",
    borderRadius: 5,
    padding: 5,
    width: 100,
    alignItems: "center",
  },
  icon: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },
};

export default Posts;
