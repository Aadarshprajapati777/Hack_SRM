import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { firebase } from "./firebase_config";
import { getFirestore, collection, addDoc,getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "firebase/firestore";
import { FlatList,ActivityIndicator } from "react-native";


const Backend_Data = () => {


    const navigation = useNavigation();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchUserData = async () => {
      const db = getFirestore();
      let q = collection(db, "users");
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
  
    useEffect(() => {   
        fetchUserData();
    }, []);

    const renderItem = ({ item }) => {
        return (
            <View style={{ marginVertical: 10 }}>
            <View
                style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 20,
                }}>
                <Image
                source={{ uri: item.profile_image }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
                />
                <View style={{ marginHorizontal: 20 }}>

                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {item.name}
                </Text>


                <Text style={{ fontSize: 14, opacity: 0.7 }}>
                    {item.profession}
                </Text>
                </View>
            </View>
            <View

                style={{
                width: "100%",
                height: 0.5,
                backgroundColor: "#e5e5e5",
                marginTop: 20,
                }}
            />
            </View>
        );
    };




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
    }

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",    
    alignItems: "center",
    justifyContent: "center",
    },
});

export default Backend_Data;

