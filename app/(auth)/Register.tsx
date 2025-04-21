import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
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
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (email !== confirmEmail) {
      setError('Emails do not match');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(Firebase_AUTH, email, password);
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(Firebase_DB, "users", user.uid), {
        username: Username,
        email: email,
        uid: user.uid,
      });

      console.log("User registered successfully:", Username, email);
      router.replace("/[home]");
    } catch (error) {
      console.error("Error registering user:", error);
      setError("Error registering. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={Username}
        onChangeText={setUsername}
        placeholderTextColor={"grey"}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor={"grey"}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Email"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        keyboardType="email-address"
        placeholderTextColor={"grey"}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={"grey"}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor={"grey"}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => router.replace("/Login")}
      >
        <Text style={styles.linkText}>Already have an account?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#2F2F2A',
  },
  header: {
    bottom:"15%",
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    color:"white",
    bottom:"10%",
    height: 50,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#22F2A',
  },
  button: {
    bottom:"10%",
    backgroundColor: '#D9D9D9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width:"30%",
    left:"70%",
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  link: {
    position:"absolute",
    left:"52%",
    top:570,
    marginTop: 0,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#007bff',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  triplogo:{
    top:"85%",
position:"absolute",
  height: 190,  // Image height
  width: 190,  // Image width
  resizeMode: 'contain',  // Ensures the image fits inside without distortion
  borderRadius: 15, 
  },

});

export default Registration;