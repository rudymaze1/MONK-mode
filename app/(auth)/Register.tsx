// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { useRouter } from 'expo-router';
// import { doc, setDoc } from 'firebase/firestore';
// import { Firebase_AUTH, Firebase_DB } from '@/config/firebaseconfig';

// const Registration = () => {
//   const [Username, setUsername] = useState("");
//   const [email, setEmail] = useState('');
//   const [confirmEmail, setConfirmEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const navigation = useNavigation();

//   const handleRegister = async () => {
//     if (email !== confirmEmail) {
//       setError('Emails do not match');
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const userCredential = await createUserWithEmailAndPassword(Firebase_AUTH, email, password);
//       const user = userCredential.user;

//       // Save user details to Firestore
//       await setDoc(doc(Firebase_DB, "users", user.uid), {
//         username: Username,
//         email: email,
//         uid: user.uid,
//       });

//       console.log("User registered successfully:", Username, email);
//       router.replace("/[home]");
//     } catch (error) {
//       console.error("Error registering user:", error);
//       setError("Error registering. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Create Account</Text>

//       {error && <Text style={styles.error}>{error}</Text>}

//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         value={Username}
//         onChangeText={setUsername}
//         placeholderTextColor={"grey"}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         placeholderTextColor={"grey"}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Email"
//         value={confirmEmail}
//         onChangeText={setConfirmEmail}
//         keyboardType="email-address"
//         placeholderTextColor={"grey"}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         placeholderTextColor={"grey"}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry
//         placeholderTextColor={"grey"}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleRegister}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator size="small" color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Register</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.link}
//         onPress={() => router.replace("/Login")}
//       >
//         <Text style={styles.linkText}>Already have an account?</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#2F2F2A',
//   },
//   header: {
//     bottom:"15%",
//     fontSize: 20,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
//   input: {
//     color:"white",
//     bottom:"10%",
//     height: 50,
//     borderColor: '#ccc',
//     borderBottomWidth: 1,
//     borderRadius: 10,
//     marginBottom: 15,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     backgroundColor: '#22F2A',
//   },
//   button: {
//     bottom:"10%",
//     backgroundColor: '#D9D9D9',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     width:"30%",
//     left:"70%",
//   },
//   buttonText: {
//     fontSize: 18,
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   link: {
//     position:"absolute",
//     left:"52%",
//     top:570,
//     marginTop: 0,
//     alignItems: 'center',
//   },
//   linkText: {
//     fontSize: 16,
//     color: '#007bff',
//   },
//   error: {
//     color: 'red',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   triplogo:{
//     top:"85%",
// position:"absolute",
//   height: 190,  // Image height
//   width: 190,  // Image width
//   resizeMode: 'contain',  // Ensures the image fits inside without distortion
//   borderRadius: 15, 
//   },

// });

// export default Registration;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Firebase_AUTH, Firebase_DB } from '@/config/firebaseconfig';

const Registration = () => {
  const [Username, setUsername] = useState("");
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    if (email !== confirmEmail) return setError('Emails do not match');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!Username.trim()) return setError('Username is required');

    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(Firebase_AUTH, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: Username });

      await setDoc(doc(Firebase_DB, "users", user.uid), {
        username: Username,
        email,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Account created", "Welcome aboard!");
      router.replace("/(drawer)");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Image source={require('@/assets/images/logomain.png')} style={styles.logo} />

        <Text style={styles.title}>Create Account</Text>
        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={Username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={confirmEmail}
          onChangeText={setConfirmEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#2F2F2A" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(auth)/Login")}>
          <Text style={styles.link}>Already have an account?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F2F2A",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: "center",
    paddingBottom: 60,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFD700",
    fontWeight: "600",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#888",
    color: "white",
    fontSize: 16,
    paddingVertical: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFD700",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2F2F2A",
  },
  link: {
    marginTop: 20,
    color: "#D9D9D9",
    textDecorationLine: "underline",
    fontSize: 14,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
