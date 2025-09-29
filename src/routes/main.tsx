
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";
import { useUser } from "@/context/user";
import { Drawer } from "./drawer";

import RegisterScreen from "@/screens/stack/auth/register";
import LoginScreen from "@/screens/stack/auth/login";
import ForgotPasswordScreen from "@/screens/stack/auth/forgotPassword";
import OnboardingScreen from "@/screens/stack/onboarding";

import Minimal from "@/ui/Header/minimal";


import ProductAddScreen from "@/screens/stack/product/add";
import StackMenu from "@/ui/Header";
import AsyncStaticScreen from "@/screens/stack/auth/async";
import { colors } from "@/ui";

//import * as Linking from 'expo-linking';
//const prefix = Linking.createURL('/');

const Stack = createStackNavigator();
export function Main() {
  const { isSignedIn, isLoading } = useUser();
  const linking = {
    prefixes: ['prostock://'],
  };

  const theme = colors();

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator id={undefined} initialRouteName="Async" screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Async" component={AsyncStaticScreen} options={{ headerShown: false, ...TransitionPresets.SlideFromRightIOS }} />
        {isSignedIn ? (
          <>
            <Stack.Screen name="Drawer" component={Drawer} options={{ ...TransitionPresets.SlideFromRightIOS }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{
              headerShown: false, ...TransitionPresets.SlideFromRightIOS
            }} />
            <Stack.Screen name="Login" component={LoginScreen}
              options={{
                title: "Entrar",
                header: ({ navigation }) => (<Minimal bg={theme.color.background} navigation={navigation} />),
                headerShown: true,
                ...TransitionPresets.SlideFromRightIOS
              }}
            />
            <Stack.Screen name="Register" component={RegisterScreen}
              options={{
                header: ({ navigation }) => (<Minimal bg={theme.color.background} navigation={navigation} />),
                headerShown: true,
                ...TransitionPresets.SlideFromRightIOS
              }}
            />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}
              options={{
                header: ({ navigation }) => (<Minimal bg={theme.color.background} navigation={navigation} />),
                headerShown: true,
                ...TransitionPresets.SlideFromRightIOS
              }}
            />
            <Stack.Screen name="ProductAdd" component={ProductAddScreen} options={{
              header: ({ navigation }) => (<StackMenu navigation={navigation} name="Novo produto" />),
              headerShown: true,
              ...TransitionPresets.SlideFromRightIOS
            }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
