import { initializeApp } from "firebase/app";
import { applyActionCode } from "firebase/auth";
// const firebaseConfig = {
//   apiKey: "AIzaSyDwIKjjsSsuLDU1WmRbevGKSfYzAenyl2Q",
//   authDomain: "naukribharat-21927.firebaseapp.com",
//   databaseURL: "https://naukribharat-21927-default-rtdb.firebaseio.com",
//   projectId: "naukribharat-21927",
//   storageBucket: "naukribharat-21927.appspot.com",
//   messagingSenderId: "904614555920",
//   appId: "1:904614555920:web:aff55cfb9e92a658157595",
//   measurementId: "G-3DXNW4XW4Y",
// };
const firebaseConfig = {
  apiKey: "AIzaSyDayI_ewGv_eg9ATmF3Hn_PLdQaisDE2kU",
  authDomain: "mobile-app-c8db0.firebaseapp.com",
  projectId: "mobile-app-c8db0",
  storageBucket: "mobile-app-c8db0.appspot.com",
  messagingSenderId: "985687342535",
  appId: "1:985687342535:web:177ba7a8c5dbe153a3ade2",
  measurementId: "G-31EVKWR3KM",
};
export const firebase = initializeApp(firebaseConfig);
