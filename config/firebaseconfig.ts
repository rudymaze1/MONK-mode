import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc  } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCMv44NpIwI6lEThWFT0Cpfz0x5skMDcQ8",
  authDomain: "aa-1-682ae.firebaseapp.com",
  projectId: "aa-1-682ae",
  storageBucket: "aa-1-682ae.firebasestorage.app",
  messagingSenderId: "773511259698",
  appId: "1:773511259698:web:225656c5c3f44e9258fe2b",
  measurementId: "G-X2XB9Y7H0R"
};


const Firebase_APP = initializeApp(firebaseConfig);
const Firebase_DB = getFirestore(Firebase_APP);
const Firebase_AUTH = initializeAuth(Firebase_APP, {
   persistence: getReactNativePersistence(AsyncStorage),
}
) ;


export {Firebase_APP, Firebase_DB, Firebase_AUTH}