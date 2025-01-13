import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useState, useEffect, useCallback } from 'react';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import * as Font from 'expo-font';
import { View, LogBox, } from 'react-native';
import { Main } from 'src/routes/main';
import { UserProvider } from '@/context/user';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from 'expo-status-bar';
const queryClient = new QueryClient();

preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    async function loadResourcesAndDataAsync() {
      try {
        await Font.loadAsync({
          Font_Book: require('./assets/fonts/Mundial_Regular.otf'),
          Font_Medium: require('./assets/fonts/Mundial_DemiBold.otf'),
          Font_Bold: require('./assets/fonts/Mundial_Bold.otf'),
          Font_Black: require('./assets/fonts/Mundial_Black.otf'),
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
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
      <UserProvider>
        <Main />
      </UserProvider>
      </QueryClientProvider>
    </View>
  );
}
