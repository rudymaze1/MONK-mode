import * as Font from "expo-font";
import { useEffect, useState } from "react";

export function useCustomFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "TechMono": require("../assets/fonts/ShareTechMono-Regular.ttf"),

        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts: ", error);
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded;
}
