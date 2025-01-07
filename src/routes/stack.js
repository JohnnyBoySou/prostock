import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import Minimal from "@/ui/Header/minimal";

import { Tabs } from "./tabs";


const Stack = createStackNavigator();

export function Stacks() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Tabs">
      <Stack.Screen name="Tabs" component={Tabs} options={{ ...TransitionPresets.SlideFromRightIOS  }} />

    </Stack.Navigator> 
  );
}

/*
  <Stack.Screen name="List" component={ListScreen} options={{
        header: ({ navigation  }) => (<Minimal navigation={navigation} />),
        headerShown: true,
        ...TransitionPresets.SlideFromRightIOS
      }} />
*/