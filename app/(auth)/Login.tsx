// import { Firebase_AUTH } from "@/config/firebaseconfig";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { Link, useRouter } from "expo-router";
// import { useState } from "react";
// import { 
//   ActivityIndicator,
//   Button, 
//   Image, 
//   KeyboardAvoidingView, 
//   Platform, 
//   StyleSheet, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   View 
// } from "react-native";
// import { useCustomFonts } from "@/hooks/usefonts";
// import AsyncStorage from "@react-native-async-storage/async-storage";


// const LoginScreen = () => {
//   const [Email, setEmail] = useState("");
//   const [Password, setPassword] = useState("");
//   const router = useRouter();
//   const fontsLoaded = useCustomFonts();

//   if (!fontsLoaded) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   const handleLogin = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(Firebase_AUTH, Email, Password);
//       console.log("Login successful", userCredential.user);
  
//       // Store session locally
//       await AsyncStorage.setItem("userToken", userCredential.user.uid);
  
//       // Navigate to home screen
//       router.replace("/[home]");
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error("Login failed:", error.message);
//         alert("Login failed: " + error.message);
//       } else {
//         console.error("An unexpected error occurred", error);
//         alert("An unexpected error occurred.");
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.titleContainer}>
//         <Image 
//           source={require("@/assets/images/logomain.png")} // Adjust path if needed
//           style={styles.logoMain} 
//         />
//       </View>

//       <Text style={styles.focustext}>
//         Nothing to it... JUST FOCUS
//       </Text>

//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.inputContainer}
//       >
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={Email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           placeholderTextColor="grey"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           value={Password}
//           onChangeText={setPassword}
//           secureTextEntry
//           placeholderTextColor="grey"
//         />

//         <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Log In</Text>
//         </TouchableOpacity>

//         <Link href="/Register" style={styles.link}>
//           <Text style={styles.registerText}>Create account</Text>
//         </Link>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 16,
//     backgroundColor: "#2F2F2A",
//   },
//   titleContainer: {
//     position: "absolute",
//     top: 50,
//     alignSelf: "center",
//   },
//   logoMain: {
//     height:250,
//     width:250,
//     right:45,
//     bottom:60,
//   },
//   inputContainer: {
//     marginTop: 20,
//     alignItems: "center",
//     width:350,
//   },
//   input: {
//     width:"100%",
//     height: 40,
//     borderBottomColor: "grey",
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     paddingLeft: 8,
//     color: "white",
//   },
//   loginButton: {
//     width: 120,
//     height: 40,
//     backgroundColor: "#D9D9D9",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 5,
//     marginTop: 10,
//     left:80,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   registerText: {
//     color: "#D9D9D9",
//     textAlign: "center",
//     textDecorationLine: "underline",
//     marginTop: 10,
//   },
//   link: {
//     marginTop: 10,
//     bottom:35,
//     right:80,
//   },
//   focustext:{
//     position: "absolute",
//     top: 250,
//     alignSelf: "center",
//     color: "white",
//     fontSize: 13,
//     fontFamily: "TechMono"
//     },
  
// });

// export default LoginScreen;


import { Firebase_AUTH } from "@/config/firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useCustomFonts } from "@/hooks/usefonts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const router = useRouter();
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(Firebase_AUTH, Email, Password);
      await AsyncStorage.setItem("userToken", userCredential.user.uid);
      router.replace("/(drawer)");
    } catch (error) {
      if (error instanceof Error) {
        alert("Login failed: " + error.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <Image
          source={require("@/assets/images/logomain.png")}
          style={styles.logo}
        />

        <Text style={styles.focusText}>Nothing to it... JUST FOCUS</Text>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={Email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={Password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>

          <Link href="/Register" style={styles.registerLink}>
            <Text style={styles.registerText}>Create Account</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F2F2A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2F2F2A",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "8%",
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    right:"20%",
    bottom:"15%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  focusText: {
    fontSize: 14,
    color: "#D9D9D9",
    fontFamily: "TechMono",
    marginBottom: 20,
  },
  inputSection: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    marginBottom: 20,
    color: "white",
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2F2F2A",
  },
  registerLink: {
    marginTop: 15,
  },
  registerText: {
    color: "#D9D9D9",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
