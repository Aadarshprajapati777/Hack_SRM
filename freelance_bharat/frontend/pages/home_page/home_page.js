import React from "react";
import { StyleSheet, Text, View } from "react-native";


const Home_Page = () => {
    return (
        <View style={styles.container}>
        <Text>This is home page</Text>
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
