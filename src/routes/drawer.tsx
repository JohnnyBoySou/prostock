import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Column, Row, Pressable, Title, Label, Image, colors, ScrollVertical, Icon, Button } from "@/ui";
import { useUser } from "@/context/user";

import { Stacks } from "./stack";
import { ImageBackground } from "expo-image";
const Drawers = createDrawerNavigator<any>();

export function Drawer() {
  return (
    <Drawers.Navigator id={undefined} initialRouteName="Stacks" screenOptions={{ headerShown: false, drawerType: "slide", swipeEdgeWidth: 100 }} drawerContent={(props) => <CustomDrawerContent {...props} />} >
      <Drawers.Screen name="Stacks" component={Stacks} />
    </Drawers.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const { logout, user } = useUser();
  const isUserPremium = false;//user?.plan === "Premium";

  const menuItems = [
    {
      icon: "House",
      label: "Início",
      onPress: () => navigation.navigate("Stacks", { screen: "Home" }),
    },
    {
      icon: "GitCompareArrows",
      label: "Movimentações",
      onPress: () => navigation.navigate("Stacks", { screen: "MoveList" }),
    },
    {
      icon: "LayoutGrid",
      label: "Produtos",
      onPress: () => navigation.navigate("Stacks", { screen: "ProductList" }),
    },
    {
      icon: "LayoutList",
      label: "Categorias",
      onPress: () => navigation.navigate("Stacks", { screen: "CategoryList" }),
    },
    {
      icon: "Truck",
      label: "Fornecedores",
      onPress: () => navigation.navigate("Stacks", { screen: "SupplierList" }),
    },
    {
      icon: "Bell",
      label: "Notificações",
      onPress: () => navigation.navigate("Stacks", { screen: "NotifyList" }),
    },
    {
      icon: "CircleUserRound",
      label: "Meu perfil",
      onPress: () => navigation.navigate("Stacks", { screen: "Profile" }),
    },
    {
      icon: "Brain",
      label: "Inteligência Artificial",
      onPress: () => { isUserPremium ? navigation.navigate("Stacks", { screen: "AI" }) : navigation.navigate("Stacks", { screen: "Plans" }) },
      isPremium: true,
    },
  ];
  const theme = colors();

  return (
    <Column ph={20} style={{ flex: 1, backgroundColor: theme.color.sidebar }}>

      <ScrollVertical>
        <Row justify="space-between" align="center" >
          <Column align="flex-start">
            <Image src={require('@/imgs/logo_img.png')} w={64} h={64} style={{ marginLeft: -46 }} />
            <Image src={require('@/imgs/logo_text_img.png')} w={100} h={24}  style={{ marginLeft: 10 }}/>
          </Column>
          <Pressable onPress={() => navigation.closeDrawer()} style={{ width: 52, height: 52, borderRadius: 100, backgroundColor: theme.color.title + 20, justifyContent: "center", alignItems: "center" }}>
            <Icon name="X" color={theme.color.title} size={24} />
          </Pressable>
        </Row>
        
        <Column mh={10} mv={6} style={{ alignSelf: 'flex-start' }}>
          <Label size={14}>Controle seu estoque na palma da sua mão</Label>
        </Column>

        <Column style={{ paddingVertical: 16 }} mb={50} mt={10}>
          {menuItems.map((item, index) => (
            <Pressable key={index} style={{ paddingVertical: 14, paddingHorizontal: 12, borderRadius: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} onPress={item.onPress}>
              <Row align="center" gh={12}>
                <Column>
                  <Icon name={item.icon as any} color={theme.color.sidebarIcon} size={20} />
                </Column>
                <Label style={{ marginTop: -4, }} color={theme.color.sidebarText}>{item?.label}</Label>
                {item?.isPremium && <Row style={{ backgroundColor: theme.color.premium, borderRadius: 100 }} pv={4} ph={8}>
                  <Icon name="Crown" color="#fff" size={16} />
                </Row>}
              </Row>
              <Icon name="ChevronRight" color="#484848" size={20} />
            </Pressable>
          ))
          }
          <Pressable style={{ paddingVertical: 14, paddingHorizontal: 12, borderRadius: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} onPress={() => logout()}>
            <Row align="center" >
              <Column style={{ marginRight: 12 }}>
                <Icon name="LogOut" color={theme.color.sidebarIcon} size={20} />
              </Column>
              <Label color={theme.color.sidebarText}>Sair</Label>
            </Row>
            <Icon name="ChevronRight" color="#484848" size={20} />
          </Pressable>
          <ImageBackground source={require('@/imgs/plan_bg_img.png')} imageStyle={{ borderRadius: 16 }} style={{ width: "100%", marginTop: 16, }}>
            <Column gv={12} pv={12} ph={16}>
              <Column style={{ width: 44, height: 44, backgroundColor: "#fff", borderRadius: 100, justifyContent: "center", alignItems: "center" }}>
                <Icon name="Crown" color={theme.color.premium} size={20} />
              </Column>
              <Title size={20} color="#fff">Desbloqueie novas funcionalidades com o Premium</Title>
              <Button label="Ver planos" onPress={() => navigation.navigate("Stacks", { screen: "Plans" })} variant="light" />
            </Column>
          </ImageBackground>
        </Column>
      </ScrollVertical>
    </Column>
  );
}

export default CustomDrawerContent;
