import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image
  } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
const Login_Page = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
          <Image source={require("./logo.png")} style={styles.logo} />
          <Text style={styles.title}>Log In</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
            <View style={styles.signupSection}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup_Page")}>
                <Text style={styles.signupButton}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Home_Page" )}>
                <Text style={styles.homescreen}>continue without login</Text>
              </TouchableOpacity>
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      },
      logo: {
        width: 140,
        height: 140,
        resizeMode: "contain",
        marginBottom: 40,
      },
    
      title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
      },
      form: {
        width: "80%",
      },
      input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 20,
        paddingLeft: 10,
        fontSize: 16,
      },
      loginButton: {
        backgroundColor: "#0077FF",
        height: 50,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
      },
      loginButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
      },
      signupSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
      },
      signupText: {
        fontSize: 16,
      },
      signupButton: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0077FF",
        marginLeft: 5,
    
      },
      homescreen: {
        display: "flex",
        fontSize: 16,
        fontWeight: "bold",
        color: "#0077FF",
        marginTop: 10,
        alignItems: "center",
        marginLeft: 70,
       },
    
    });
  
export default Login_Page;

