import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Backend_Data from "../../../backend/firebase/backend_data";


const Home_Page = () => {
    return (
        <View style={styles.container}>
        <Text>This is home page</Text>
        <Backend_Data />
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

export default Home_Page;
