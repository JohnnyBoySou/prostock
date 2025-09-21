import "react-native-gesture-handler";
import "react-native-reanimated";
import React, { useState, useEffect, useCallback } from "react";
import { preventAutoHideAsync, hideAsync } from "expo-splash-screen";
import * as Font from "expo-font";
import { View, LogBox } from "react-native";
import { Main } from "src/routes/main";
import { StatusBar } from "expo-status-bar";
import AppProviders from "@/context/providers";

preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    /*
    const handleNotification = async () => {
      const key = process.env.EXPO_PUBLIC_KEY || Constants.expoConfig.extra.oneSignalAppId;
      if (key != null) {
        OneSignal.initialize(key);
      }

      let { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        status = newStatus;
        console.log('status', status)
      }
      if (status !== 'granted') {
        console.log('permitido')
      }
    }
    handleNotification();
*/
    async function loadResourcesAndDataAsync() {
      try {
        await Font.loadAsync({
          Font_Book: require("./assets/fonts/Mundial_Regular.otf"),
          Font_Medium: require("./assets/fonts/Mundial_DemiBold.otf"),
          Font_Bold: require("./assets/fonts/Mundial_Bold.otf"),
          Font_Black: require("./assets/fonts/Mundial_Black.otf"),
          Font_Light_Italic: require("./assets/fonts/Mundial_Light_Italic.otf"),
        });
        setAppIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="auto" />
        <AppProviders>
          <Main />
        </AppProviders>
    </View>
  );
}
