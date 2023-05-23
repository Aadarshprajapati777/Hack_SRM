import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image } from "react-native";
import { Linking } from "react-native";

const Backend_Data = (props) => {
  let uid = props.uid || "";
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (profession) => {
    const db = getFirestore();
    let q = collection(db, "users");
    if (profession) {
      q = query(q, where("profession", "==", profession));
    }
    const querySnapshot = await getDocs(q);
    const storage = getStorage();
    const userData = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const profileImageUrl = await getDownloadURL(
          ref(storage, doc.data().imageUrl)
        );
        return {
          name: doc.data().fullName,
          profile_image: profileImageUrl,
          address: doc.data().address,
          profession: doc.data().profession,
          contact: doc.data().phoneNumber,
          id: doc.id,
          userId: doc.data().userId,
          ...doc.data(),
        };
      })
    );
    setData(userData);
    setLoading(false);
  };
  const fetchUserDatabyLocation = async (nearbyUserid, distance) => {
    console.log("nearbyUser distance", distance);
    const roundedDistance = distance.toFixed(2); // Round the distance to three decimal places
    const distanceString = roundedDistance.toString(); // Convert the distance to a string
  
    const db = getFirestore();
    let q = collection(db, "users");
  
    if (nearbyUserid) {
      q = query(q, where("userId", "==", nearbyUserid));
      const querySnapshot = await getDocs(q);
      const storage = getStorage();
      const userData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const profileImageUrl = await getDownloadURL(
            ref(storage, doc.data().imageUrl)
          );
          return {
            name: doc.data().fullName,
            profile_image: profileImageUrl,
            address: doc.data().address,
            profession: doc.data().profession,
            contact: doc.data().phoneNumber,
            id: doc.id,
            userId: doc.data().userId,
            distance: distanceString, // Use the rounded distance string
            ...doc.data(),
          };
        })
      );
      return userData; // Return the new data
    }
  };
  
  const filterNearbyUsersByProfession = (data, profession) => {
    if (profession) {
      const filteredData = data.filter(
        (user) => user.profession === profession
      );
      // Perform further actions with the filtered data
      console.log("Filtered Data:", filteredData);
      setData(filteredData);
    } else {
      console.log("Filtered Data:", data);
      setData(data);
    }
  };

  if (props.islocationclicked) {
    useEffect(() => {
      if (props.nearbyUsers.length > 0) {
        const fetchData = async () => {
          const newData = await Promise.all(
            props.nearbyUsers.map((item) => {
              return fetchUserDatabyLocation(item.userId,item.distance);
            })
          );
          const mergedData = newData.flat();
          setData(mergedData);
          console.log("in mergerd data checking profession", props.profession);
          filterNearbyUsersByProfession(mergedData, props.profession);
          setLoading(false);
        };

        fetchData();
      }
    }, [props.nearbyUsers, props.profession]);
  } else {
    useEffect(() => {
      fetchUserData(props.profession);
    }, [props.profession]);
  }

  useEffect(() => {
    console.log("UID changed:", props.uid);
  }, [props.uid]);

  const handCallClick = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessageClick = (phoneNumber) => {
    const messageUrl = `sms:${phoneNumber}`;
    Linking.openURL(messageUrl);
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("UserProfile", { state: item })}
        >
          <View
            style={{
              overflow: "hidden",
              borderRadius: 50,
              marginLeft: 10,
              position: "relative",
            }}
          >
            <Image
              style={[{ width: 50, height: 50, borderRadius: 50 }]}
              source={{ uri: item.profile_image }}
            />
            {item.userId === uid && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  borderColor: "green",
                  borderWidth: 5,
                }}
              ></View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View
            style={{
              marginLeft: 5,
              width: 165,
            }}
          >
            <Text style={{ fontSize: 17 }}>{item.name}</Text>
          <Text style={{ fontSize: 13 }}>{item.address}</Text>
          {item.distance && <Text style={{ fontSize: 9, color: "grey" }}>{item.distance} km away</Text>}          
          </View>
        </TouchableOpacity>  
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => handCallClick(item.contact)}
        >
          <Icon name="phone" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => handleMessageClick(item.contact)}
        >
          <Icon name="comment" size={25} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderFooter = () => {
    if (loading) {
      return (
        <ActivityIndicator
          style={{ marginVertical: 20 }}
          size="large"
          color="#0000ff"
        />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={{ marginHorizontal: 5 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default Backend_Data;
