// import { AuthProvider } from "@/context/authContex";
// import { Stack } from "expo-router";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { StyleSheet } from "react-native";

// export default function RootLayout() {
//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <AuthProvider>
//         <Stack>
//           <Stack.Screen name="index" options={{ headerShown: false }} />
//           <Stack.Screen name="(auth)/Login" options={{ title: "login", headerShown: false }} />
//           <Stack.Screen name="(auth)/Register" options={{ title: "register", headerShown: false }} />
//           <Stack.Screen name="(root)/[home]" options={{ title: "register", headerShown: false }} />
//         </Stack>
//       </AuthProvider>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });


import { useEffect, useCallback, useState } from "react";
import { AuthProvider } from "@/context/authContex";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Prevent splash from auto-hiding until we're ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Do any loading or async logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // optional delay
      setAppIsReady(true);
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/Register" options={{ headerShown: false }} />
          <Stack.Screen name="(root)/[home]" options={{ headerShown: false }} />
          <Stack.Screen name="(root)/setting" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
