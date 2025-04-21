// import { Firebase_AUTH } from "@/config/firebaseconfig";
// import { signInWithEmailAndPassword } from "@firebase/auth";
// import { Link, useRouter } from "expo-router";
// import { useState } from "react"
// import { Button, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";




// const LoginScreen = () => {
//   const [Email, setEmail] = useState('');
//   const [Password, setPassword] = useState('');
//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       // Log in the user
//       const userCredential = await signInWithEmailAndPassword(Firebase_AUTH, Email, Password);
//       console.log('Login successful', userCredential.user);

//       // Navigate to the home page
//       router.replace("/home");


//   }}
//    return (
//     <View style={styles.container}>
//       <View style={styles.titlecontainer}>
//         <Image 
//           source={require('/Users/rudy/Desktop/react-proj/MONK-mode/assets/images/logomain.png')} 
//           style={styles.logomain} 
//         />
//       </View>

//       <Text style={styles.focustext}>
//         nothing to it... JUST FOCUS
//       </Text>

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.inputContainer}
//       >
//         <TextInput
//           style={styles.input}
//           placeholder="email"
//           value={Email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           placeholderTextColor={"grey"}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="password"
//           value={Password}
//           onChangeText={setPassword}
//           secureTextEntry
//           placeholderTextColor={"grey"}
//         />
     

//       <TouchableOpacity style={styles.loginbutton} onPress={handleLogin}>
//         <Text style={{ fontSize: 20 }}>
//           Log In
//         </Text>
//       </TouchableOpacity>

//       <Link href={"/Register"} style={styles.link}>
//       <Text style={styles.registertext}>Create account</Text>
//       </Link>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };




// const styles = StyleSheet.create ({
//     titlecontainer:{
//         position:'fixed',
//         bottom:200,
//     },
//     link:{
//         position:'absolute',
//         top:80,
//         right:145,
//       },
//     inputContainer: {
//         marginBottom: 20,
//     },
//    container:{
//        flex:1,
//        justifyContent: 'center',
//        padding: 16,
//        backgroundColor:"#2F2F2A"
//    },
//    input:{
//        height:40,
//        borderBlockColor: 'grey',
//        borderWidth:1,
//        marginBottom: 12,
//        paddingLeft: 8,
//        borderTopWidth:0,
//        borderLeftWidth:0,
//        borderRightWidth:0,
//        bottom:40,
//    },
//    registertext:{
//     bottom:60,
//     right:80,
//     color:'#D9D9D9',
//     textAlign: 'center',
//     textDecorationLine:'underline',
//    },
//    logomain:{
//     height:250,
//     width:250,
//     right:45,
//    },
//    loginbutton:{
//     borderWidth:0,
//     width:83,
//     height:34,
//     left:165,
//     backgroundColor:"#D9D9D9",
//     justifyContent: 'center',
//     alignItems:"center",
//     bottom:30,
//    },
//    focustext:{
//     bottom:150,
//     left:30,
//     color:"white",
//    }
   
// })

// export default LoginScreen;










import { Firebase_AUTH } from "@/config/firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { 
  ActivityIndicator,
  Button, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from "react-native";
import { useCustomFonts } from "@/hooks/usefonts";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginScreen = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const router = useRouter();
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(Firebase_AUTH, Email, Password);
      console.log("Login successful", userCredential.user);
  
      // Store session locally
      await AsyncStorage.setItem("userToken", userCredential.user.uid);
  
      // Navigate to home screen
      router.replace("/[home]");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
        alert("Login failed: " + error.message);
      } else {
        console.error("An unexpected error occurred", error);
        alert("An unexpected error occurred.");
      }
    }
  };


  // const handleLogin = async () => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(Firebase_AUTH, Email, Password);
  //     console.log("Login successful", userCredential.user);
  
  //     // Navigate to the home page
  //     router.replace("/[home]");
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error("Login failed:", error.message);
  //       alert("Login failed: " + error.message);
  //     } else {
  //       console.error("An unexpected error occurred", error);
  //       alert("An unexpected error occurred.");
  //     }
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image 
          source={require("@/assets/images/logomain.png")} // Adjust path if needed
          style={styles.logoMain} 
        />
      </View>

      <Text style={styles.focustext}>
        Nothing to it... JUST FOCUS
      </Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={Email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="grey"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={Password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="grey"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Link href="/Register" style={styles.link}>
          <Text style={styles.registerText}>Create account</Text>
        </Link>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#2F2F2A",
  },
  titleContainer: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
  },
  logoMain: {
    height:250,
    width:250,
    right:45,
    bottom:60,
  },
  inputContainer: {
    marginTop: 20,
    alignItems: "center",
    width:350,
  },
  input: {
    width:"100%",
    height: 40,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    color: "white",
  },
  loginButton: {
    width: 120,
    height: 40,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
    left:80,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    color: "#D9D9D9",
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 10,
  },
  link: {
    marginTop: 10,
    bottom:35,
    right:80,
  },
  focustext:{
    position: "absolute",
    top: 250,
    alignSelf: "center",
    color: "white",
    fontSize: 13,
    fontFamily: "TechMono"
    },
  
});

export default LoginScreen;
