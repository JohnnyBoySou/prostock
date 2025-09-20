import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useState, useEffect, useCallback } from 'react';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import * as Font from 'expo-font';
import { View, LogBox, } from 'react-native';
import { Main } from 'src/routes/main';
import { UserProvider } from '@/context/user';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from 'expo-status-bar';
import ToastManager from 'toastify-react-native';
const queryClient = new QueryClient();
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { OneSignal } from 'react-native-onesignal';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import {
  CustomToast,
  ErrorToast,
  WarningToast,
  SuccessToast,
  InfoToast,
} from "@/hooks/useToast";

const toastConfig = {
  custom: (props) => <CustomToast {...props} />,
  success: (props) => <SuccessToast {...props} />,
  error: (props) => <ErrorToast {...props} />,
  warning: (props) => <WarningToast {...props} />,
  info: (props) => <InfoToast {...props} />,
};


preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs(true);

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
        <GestureHandlerRootView style={{ flex: 1 }}>
        <UserProvider>
          <Main />
          <ToastManager
            position="bottom"
            duration={2000}
            showCloseIcon={false}
            autoHide={true}
            showProgressBar={false}
            animationStyle="fade"
            bottomOffset={50}
            config={toastConfig}
          />
        </UserProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </View>
  );
}
