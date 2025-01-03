import { getFocusedRouteNameFromRoute, useRoute } from "@react-navigation/native";
import { createBottomTabNavigator   } from "@react-navigation/bottom-tabs";

import { MotiView } from "moti";
import * as Haptics from "expo-haptics";

import HomePage from "@/screens/tabs/home";

import { Home, Library, Search, Store } from "lucide-react-native";
import { Pressable, Text, View, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

export function Tabs() {
  const route = useRoute();
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
  return (
    <Tab.Navigator initialRouteName="Home" tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{
      headerShown: false, 
      tabBarStyle: { height: 72, backgroundColor: "transparent", borderTopWidth: 0, position: "absolute", bottom: 30, left: 0, right: 0 },
      tabBarBackground: () => (
        <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
      )
    }}> 
      <Tab.Screen name="Home" component={HomePage} options={{
        backBehavior: "initialRoute",
        tabBarIcon: ({ color, size }) => (
          <Home color={color} size={size} strokeWidth={routeName == "Home" ? 2.5 : 1.5}/>
        )
      }} />
      
    </Tab.Navigator>
  );
}
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ height: 72, backgroundColor: "none", position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <View style={{ flexDirection: "row", height: "100%" }}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key
              });
            };

            const Icon = options.tabBarIcon;

       
            return (
              <Pressable
                key={route.key}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
              >
                <MotiView
                  from={{ scale: 1, opacity: 0, translateY: 20 }}
                  animate={{ scale: isFocused ? 1.2 : 1, opacity: isFocused ? 1 : 0.7, translateY: isFocused ? 0 : 5 }}
                  transition={{ type: "timing", duration: 200 }}
                >
                  {Icon && <Icon color={"#FFF"} size={24} />}
                </MotiView>
              </Pressable>
            );
          })}
        </View>
    </View>
  );
}

/*
screenOptions={{
        tabBarShowLabel: false,
        tabBarButton: (props) => {
          return (<Pressable {...props} style={{ borderRadius: 12, backgroundColor: "blue", flexGrow: 1, height: 64, justifyContent: "center", alignItems: "center"  }} />);
        },
        headerShown: false,
        backBehavior: "none",
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#808080",
        tabBarStyle: {
          position: "absolute",
          height: 82,
          alignItems: "center",
          backgroundColor: "transparent",
          borderTopWidth: 0 
        },
        tabBar: (props) => {
          return (<LinearGradient colors={["#000000", "red"]} start={[1, 0]} end={[0, 0]}> <BottomTabBar {...props}  /> </LinearGradient>); 
        }

      }} */
