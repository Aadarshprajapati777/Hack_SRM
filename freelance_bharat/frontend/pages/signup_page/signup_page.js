import React from "react";
import { StyleSheet, Text, View } from "react-native";


const Signup_Page = () => {
    return (
        <View style={styles.container}>
        <Text>This is signup page</Text>
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

export default Signup_Page;
