import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen';
import * as Font from 'expo-font';
import { View, LogBox, useColorScheme,} from 'react-native';
import Router from './src/router';
import { StatusBar } from 'expo-status-bar';
import light from '@theme/light';
import dark from '@theme/dark';

preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const theme = useColorScheme();
  const selectTheme = theme === 'light' ? light : dark;
  console.log(theme)
  useEffect(() => {
    LogBox.ignoreAllLogs(true);

    //caregamento das fontes local
    async function loadResourcesAndDataAsync() {
      try {
        await Font.loadAsync({
          Font_Book: require('./assets/fonts/Inter_Book.ttf'),
          Font_Medium: require('./assets/fonts/Inter_Medium.ttf'),
          Font_Bold: require('./assets/fonts/Inter_Bold.ttf'),
          Font_Black: require('./assets/fonts/Inter_Black.ttf'),
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
      <ThemeProvider theme={selectTheme}> 
          <StatusBar translucent animated={true} />
          <Router />
      </ThemeProvider>
    </View>
  );
}
