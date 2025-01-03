import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";

import { View, Image, Pressable, Linking } from "react-native";
import { Column, Row, Title, Label } from "@/ui";

import { Bell, Settings, Star, LogOut, ChevronRight } from "lucide-react-native"; 
import { useUser } from "@/context/user";
import { MotiImage } from "moti";

import { Stacks } from "./stack";

const Drawers = createDrawerNavigator();

export function Drawer() {
  return ( 
    <Drawers.Navigator screenOptions={{ headerShown: false, drawerType: "slide", swipeEdgeWidth: 100 }} drawerContent={(props) => <CustomDrawerContent {...props}  />} >
      <Drawers.Screen name="Stacks" component={Stacks} />
    </Drawers.Navigator> 
  );
}

function CustomDrawerContent({  }) {
  const { user, logout } = useUser();
  const navigation = useNavigation();

  const account = [
    {
      icon: <Star color="#fff" size={20} />,
      label: "Avalie-nos",
      onPress: () => Linking.openURL("https://play.google.com/store/apps/details?id=com.s2mangas.star")
    }, 
    {
      icon: <Settings color="#fff" size={20} />,
      label: "Configurações",
      onPress: () => navigation.navigate("Settings")
    }, {
      icon: <LogOut color="#fff" size={20} />,
      label: "Sair",
      onPress: () => logout()
    }
  
  
  ];

  return (
    <Column ph={20} pv={40} style={{ flex: 1, backgroundColor: "#101010" }}>
      <Row justify="space-between" align="center" > 
        <Pressable onPress={() => navigation.navigate("Notifications")} style={{ width: 52, height: 52, borderRadius: 12, backgroundColor: "#202020", justifyContent: "center", alignItems: "center"   }}>
          <Bell size={24} color="#ffFFFf90" />
        </Pressable>
      </Row>
      <Pressable style={{ marginVertical: 20, paddingVertical: 6, paddingHorizontal: 6, backgroundColor: "#202020", borderRadius: 12 }} onPress={() => navigation.navigate("Account")}>
        <Row align="center">
          <Image
            source={{ uri: user?.avatar }}
            style={{ width: 56, height: 56, borderRadius: 8, marginRight: 12 }}
          />
          <Column gv={4}>
            <Title size={18}>{user?.name}</Title>
            <Label size={12}>Ver perfil</Label>
          </Column>
        </Row>
      </Pressable>

      <Column style={{ paddingVertical: 16 }}>
        {account.map((item, index) => (
          <Pressable key={index} style={{ paddingVertical: 14, paddingHorizontal: 12, borderRadius: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} onPress={item.onPress}>
            <Row align="center" >
              <View style={{ marginRight: 12 }}>
                {item.icon}
              </View>
              <Label color="#fff">{item.label}</Label>
            </Row>
            <ChevronRight color="#fffFFF90" size={20} />
          </Pressable>
        ))
        }

      </Column>
    </Column>
  );
}

export default CustomDrawerContent;
