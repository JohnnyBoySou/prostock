import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { View, Pressable } from "react-native";
import { Column, Row, Title, Label, Image, colors } from "@/ui";

import { LogOut, ChevronRight, X, CircleUserRound, Brain, ChartPie, GitCompareArrows, LayoutGrid, Truck, Users, Store, House, LayoutList, Bell } from "lucide-react-native";
import { useUser } from "@/context/user";

import { Stacks } from "./stack";

const Drawers = createDrawerNavigator();

export function Drawer() {
  return (
    <Drawers.Navigator initialRouteName="Stacks" screenOptions={{ headerShown: false, drawerType: "slide", swipeEdgeWidth: 100 }} drawerContent={(props ) => <CustomDrawerContent {...props} />} >
      <Drawers.Screen name="Stacks" component={Stacks} />
    </Drawers.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const { user, logout } = useUser();
 

  const account = [
    {
      icon: <House color="#484848" size={20} />,
      label: "Início",
      onPress: () => navigation.navigate("Stacks", { screen: "Home" })
    },
    {
      icon: <Store color="#484848" size={20} />,
      label: "Lojas",
      onPress: () => navigation.navigate("Stacks", { screen: "StoreList" })
    },
    {
      icon: <Users color="#484848" size={20} />,
      label: "Usuários",
      onPress: () => navigation.navigate("Stacks", { screen: "UserList" })
    },
    {
      icon: <Truck color="#484848" size={20} />,
      label: "Fornecedores",
      onPress: () => navigation.navigate("Stacks", { screen: "SupplierList" })
    },
    {
      icon: <LayoutGrid color="#484848" size={20} />,
      label: "Produtos",
      onPress: () => navigation.navigate("Stacks", { screen: "ProductList" })
    },
    {
      icon: <LayoutList color="#484848" size={20} />,
      label: "Categorias",
      onPress: () => navigation.navigate("Stacks", { screen: "CategoryList" })
    },
    {
      icon: <GitCompareArrows color="#484848" size={20} />,
      label: "Movimentações",
      onPress: () => navigation.navigate("Stacks", { screen: "MoveList" })
    },
    {
      icon: <ChartPie color="#484848" size={20} />,
      label: "Relatórios",
      onPress: () => navigation.navigate("Stacks", { screen: "ReportList" })
    },
    {
      icon: <Brain color="#484848" size={20} />,
      label: "Inteligência Artificial",
      onPress: () => navigation.navigate("Stacks", { screen: "AI" })
    },
    {
      icon: <Bell color="#484848" size={20} />,
      label: "Notificações",
      onPress: () => navigation.navigate("Stacks", { screen: "NotifyList" })
    },
    {
      icon: <CircleUserRound color="#484848" size={20} />,
      label: "Meu perfil",
      onPress: () => navigation.navigate("Stacks", { screen: "Profile"})
    },
    {
      icon: <LogOut color="#484848" size={20} />,
      label: "Sair",
      onPress: () => logout()
    }
  ];

  return (
    <Column ph={20} pv={40} style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Row justify="space-between" align="center" >
        <Image src={require('@/imgs/logo_red.png')} w={64} h={64} />
        <Pressable onPress={() => navigation.closeDrawer()} style={{ width: 52, height: 52, borderRadius: 100, backgroundColor: "#EDF0F1", justifyContent: "center", alignItems: "center" }}>
          <X size={24} color="#00000050" />
        </Pressable>
      </Row>

      <Column mv={12} mh={10}>
        <Title color={colors.color.primary}>ProStock</Title>
      </Column>
  
      <Column style={{ paddingVertical: 16 }} mb={50} mt={10}>
        {account.map((item, index) => (
          <Pressable key={index} style={{ paddingVertical: 14, paddingHorizontal: 12, borderRadius: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} onPress={item.onPress}>
            <Row align="center" >
              <View style={{ marginRight: 12 }}>
                {item.icon}
              </View>
              <Label>{item.label}</Label>
            </Row>
            <ChevronRight color="#484848" size={20} />
          </Pressable>
        ))
        }
      </Column>
      <Label>Versão 1.2</Label>
    </Column>
  );
}

export default CustomDrawerContent;
