import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useState, useEffect, useCallback } from 'react';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import * as Font from 'expo-font';
import { View, LogBox, } from 'react-native';
import { Main } from 'src/routes/main';
import { UserProvider } from '@/context/user';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    async function loadResourcesAndDataAsync() {
      try {
        await Font.loadAsync({
          Font_Book: require('./assets/fonts/Mundial Regular.otf'),
          Font_Medium: require('./assets/fonts/Mundial DemiBold.otf'),
          Font_Bold: require('./assets/fonts/Mundial Bold.otf'),
          Font_Black: require('./assets/fonts/Mundial Black.otf'),
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
      <UserProvider>
        <Main />
      </UserProvider>
      </QueryClientProvider>
    </View>
  );
}
