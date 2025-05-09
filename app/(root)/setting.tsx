import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Firebase_AUTH } from '@/config/firebaseconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font'; // ✅ Import useFonts
import { customFontsToLoad } from '@/constants/fonts'; // ✅ Import customFontsToLoad

export default function SettingsScreen() {
  const [fontsLoaded] = useFonts(customFontsToLoad); // ✅ Load fonts
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false);

  if (!fontsLoaded) {
    return null; // ✅ Don't render until fonts are loaded
  }

  const handleLogout = async () => {
    try {
      await signOut(Firebase_AUTH);
      await AsyncStorage.removeItem('userToken');
      router.replace('/(auth)/Login');
    } catch (error) {
      Alert.alert('Logout Failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const settingsItems = [
    { icon: 'notifications-outline', label: 'Notification', type: 'switch' },
    { icon: 'star-outline', label: 'Rate App' },
    { icon: 'share-social-outline', label: 'Share App' },
    { icon: 'lock-closed-outline', label: 'Privacy Policy' },
    { icon: 'document-text-outline', label: 'Terms and Conditions' },
    { icon: 'document-outline', label: 'Cookies Policy' },
    { icon: 'mail-outline', label: 'Contact' },
    { icon: 'chatbox-ellipses-outline', label: 'Feedback' },
  ];

  return (
    <View style={styles.container}>
      <View style={{alignItems:'center'}}>
      <Text style={styles.header}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => Alert.alert(`${item.label}`, 'This is a placeholder')}
            activeOpacity={0.7}
          >
            <View style={styles.itemLeft}>
              <Ionicons name={item.icon as any} size={20} color="#D9D9D9" />
              <Text style={styles.itemText}>{item.label}</Text>
            </View>
            {item.type === 'switch' ? (
              <Switch
                value={isNotificationsEnabled}
                onValueChange={setIsNotificationsEnabled}
                trackColor={{ false: '#555', true: '#FFD700' }}
                thumbColor={isNotificationsEnabled ? '#FFD700' : '#ccc'}
              />
            ) : (
              <Ionicons name="chevron-forward-outline" size={18} color="#888" />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
          <View style={styles.itemLeft}>
            <Ionicons name="exit-outline" size={20} color="#E53935" />
            <Text style={[styles.itemText, { color: '#E53935' }]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2F2A',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontFamily: "poppins-bold",
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#FFD700',
    
  },
  list: {
    paddingBottom: 40,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontFamily: 'poppins-light', // ✅ Custom font applied
    fontSize: 16,
    color: '#D9D9D9',
  },
  logoutItem: {
    marginTop: 30,
    paddingVertical: 15,
    borderTopColor: '#444',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
