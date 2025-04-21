// import { SafeAreaView, Text, View } from "react-native";
// import LoginScreen from "./(auth)/Login";

// export default function Index() {
//   return (
//     <SafeAreaView 
//     style={{
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       backgroundColor:"#2F2F2A"
//     }}
//     >
      
//       <LoginScreen/>
      
//     </SafeAreaView>
//   );
// }


import { useEffect, useState } from "react";
import { SafeAreaView, ActivityIndicator } from "react-native";
import { Firebase_AUTH } from "@/config/firebaseconfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import LoginScreen from "./(auth)/Login";
import Main from "./(root)/[home]";
import { StyleSheet, ViewStyle } from "react-native";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userToken");
        if (storedUser) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    const unsubscribe = onAuthStateChanged(Firebase_AUTH, (user) => {
      if (user) {
        AsyncStorage.setItem("userToken", user.uid);
        setIsAuthenticated(true);
      } else {
        AsyncStorage.removeItem("userToken");
        setIsAuthenticated(false);
      }
    });

    checkAuth();
    return () => unsubscribe(); // Cleanup listener when unmounted
  }, []);

  if (isAuthenticated === null) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isAuthenticated ? <Main/> : <LoginScreen />}
    </SafeAreaView>
  );
}

const styles: { container: ViewStyle; loadingContainer: ViewStyle } = {
  container: {
    flex: 1,
    backgroundColor: "#2F2F2A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Correct type
    backgroundColor: "#2F2F2A",
  },
};