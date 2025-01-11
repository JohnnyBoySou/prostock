
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";
import { useUser } from "@/context/user";
import { Drawer } from "./drawer";

import RegisterScreen from "@/screens/stack/auth/register";
import LoginScreen from "@/screens/stack/auth/login";
import OnboardingScreen from "@/screens/stack/auth/onboarding";

import Minimal from "@/ui/Header/minimal";


import ProductAddScreen from "@/screens/stack/product/add";
import StackMenu from "@/ui/Header";

const Stack = createStackNavigator();

export function Main() {
  const { isSignedIn, isLoading } = useUser();

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        {isSignedIn ? (
          <>
            <Stack.Screen name="Drawer" component={Drawer} options={{ ...TransitionPresets.SlideFromRightIOS }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ ...TransitionPresets.SlideFromRightIOS }} />
            <Stack.Screen name="Login" component={LoginScreen}
              options={{
                title: "Entrar",
                header: ({ navigation }) => (<Minimal navigation={navigation} scene="Entrar" />),
                headerShown: true,
                ...TransitionPresets.SlideFromRightIOS
              }}
            />
            <Stack.Screen name="Register" component={RegisterScreen}
              options={{
                header: ({ navigation, scene }) => (<Minimal navigation={navigation} scene="Criar conta" />),
                headerShown: true,
                ...TransitionPresets.SlideFromRightIOS
              }}
            />
            <Stack.Screen name="ProductAdd" component={ProductAddScreen} options={{
              header: ({ navigation, scene }) => (<StackMenu navigation={navigation} name="Novo produto" />),
              headerShown: true,
              ...TransitionPresets.SlideFromRightIOS
            }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
