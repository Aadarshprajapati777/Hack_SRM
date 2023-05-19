import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Landing_Page from "./frontend/pages/landing_page/landing_page";
import Login_Page from "./frontend/pages/login_page/login_page";
import Signup_Page from "./frontend/pages/signup_page/signup_page";
import Home_Page from "./frontend/pages/home_page/home_page";

const Stack = createNativeStackNavigator();

const MyStack = () => {
   return (
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen
        name="Landing_Page"
        component={Landing_Page}
        options={{ title: "LandingPage" }}
      />

      <Stack.Screen
        name="Login_Page"
        component={Login_Page}
        options={{ title: "LoginPage" }}
      />

      <Stack.Screen
        name="Signup_Page"
        component={Signup_Page}
        options={{ title: "SignupPage" }}
      />

      <Stack.Screen
        name="Home_Page"
        component={Home_Page}
        options={{ title: "HomePage" }}
      />

    </Stack.Navigator>
  </NavigationContainer>
  );
};

export default MyStack;


