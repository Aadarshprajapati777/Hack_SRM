import React from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
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
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  postContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
userId: {
  color: '#333333',
  fontWeight: 'bold',
  fontSize: 22,
  marginTop: 5,
  borderBottomWidth: 2,
  borderBottomColor: '#f44336',
  paddingBottom: 4, // Add padding to create space between the text and border
  fontFamily: 'Roboto', // Apply a custom font if desired
},



  postBody: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  postText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: '#FF4081',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
};

export default Posts;
