import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Backend_Data = () => {
    return (
        <View style={styles.container}>
        <Text>This is backend data</Text>
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

