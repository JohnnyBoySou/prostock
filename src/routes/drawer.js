import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { View, Pressable } from "react-native";
import { Column, Row, Title, Label, Image } from "@/ui";

import { LogOut, ChevronRight, X, CircleUserRound, Brain, ChartPie, GitCompareArrows, LayoutGrid, Truck, Users, Store, House } from "lucide-react-native";
import { useUser } from "@/context/user";
import { getStore } from "@/hooks/store";

import StoreSelectScreen from "../screens/stack/store/select";
import StackMenu from "@/ui/Header";


import { Stacks } from "./stack";
import { useIsFocused } from "@react-navigation/native";

const Drawers = createDrawerNavigator();

export function Drawer() {
  return (
    <Drawers.Navigator initialRouteName="Stacks" screenOptions={{ headerShown: false, drawerType: "slide", swipeEdgeWidth: 100 }} drawerContent={(props ) => <CustomDrawerContent {...props} />} >
      <Drawers.Screen name="Stacks" component={Stacks} />
      <Drawers.Screen name="StoreSelect" component={StoreSelectScreen} options={{ header: ({ navigation,  }) => (<StackMenu navigation={navigation} name="Selecionar loja" />), headerShown: true,  }} />
    </Drawers.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const { user, logout } = useUser();
  const [loading, setloading] = useState(true);
  const [store, setstore] = useState();

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchStore = async () => {
      setloading(true)
      try {
        const res = await getStore();
        setstore(res);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    }
    if (isFocused) {
      fetchStore();
    }
  }, [isFocused]);

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
      icon: <CircleUserRound color="#484848" size={20} />,
      label: "Meu perfil",
      onPress: () => navigation.navigate("Profile")
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
      <Pressable style={{ marginVertical: 20, borderWidth: 1, borderColor: '#d1d1d1', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 6 }} onPress={() => navigation.navigate("StoreSelect")}>
        {loading ? <Label>Carregando...</Label> :
        <Row align="center" justify='space-between'>
          <Column gv={4}>
            <Title size={18}>{store?.nome}</Title>
            <Label size={12}>ALTERAR</Label>
          </Column>
          <ChevronRight color="#484848" size={20} />
        </Row>}
      </Pressable>

      <Column style={{ paddingVertical: 16 }} mb={50}>
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
