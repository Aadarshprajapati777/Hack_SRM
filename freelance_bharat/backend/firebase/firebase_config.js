import { initializeApp } from "firebase/app";
import { applyActionCode } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDwIKjjsSsuLDU1WmRbevGKSfYzAenyl2Q",
  authDomain: "naukribharat-21927.firebaseapp.com",
  databaseURL: "https://naukribharat-21927-default-rtdb.firebaseio.com",
  projectId: "naukribharat-21927",
  storageBucket: "naukribharat-21927.appspot.com",
  messagingSenderId: "904614555920",
  appId: "1:904614555920:web:aff55cfb9e92a658157595",
  measurementId: "G-3DXNW4XW4Y",
};

export const firebase = initializeApp(firebaseConfig);