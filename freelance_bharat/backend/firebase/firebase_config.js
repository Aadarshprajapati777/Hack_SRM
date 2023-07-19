import { initializeApp } from "firebase/app";
import { applyActionCode } from "firebase/auth";
import EXPO_PUBLIC_API_KEY from "./../../.env";
import EXPO_PUBLIC_MSG_ID from "./../../.env";
import EXPO_PUBLIC_APP_ID from "./../../.env";

const firebaseConfig = {
  apiKey: EXPO_PUBLIC_API_KEY,
  authDomain: "nextjs-b3689.firebaseapp.com",
  projectId: "nextjs-b3689",
  storageBucket: "nextjs-b3689.appspot.com",
  messagingSenderId: EXPO_PUBLIC_MSG_ID,
  appId: EXPO_PUBLIC_APP_ID,
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
