import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { View, Pressable } from "react-native";
import { Column, Row, Title, Label, Image, colors, ScrollVertical, useFetch } from "@/ui";

import { LogOut, ChevronRight, X, CircleUserRound, Brain, ChartPie, GitCompareArrows, LayoutGrid, Truck, Users, Store, House, LayoutList, Bell, Upload } from "lucide-react-native";
import { useUser } from "@/context/user";

import { Stacks } from "./stack";
import { AuthService } from "../services/auth";
import { ProfilePermissionsResponse } from "../services/auth";
const Drawers = createDrawerNavigator();

export function Drawer() {
  return (
    <Drawers.Navigator id={undefined} initialRouteName="Stacks" screenOptions={{ headerShown: false, drawerType: "slide", swipeEdgeWidth: 100 }} drawerContent={(props) => <CustomDrawerContent {...props} />} >
      <Drawers.Screen name="Stacks" component={Stacks} />
    </Drawers.Navigator>
  );
}

function CustomDrawerContent({ navigation }) {
  const { data: permissions, isLoading, refetch } = useFetch({
    key: 'permissions',
    fetcher: async () => {
      const res = await AuthService.getProfilePermissions();
      return res;
    },
  })

  const { logout, role } = useUser();

  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (requiredPermission: string): boolean => {
    if (!permissions?.effectivePermissions) return false;
    
    // Verifica se tem a permissão exata
    if (permissions.effectivePermissions.includes(requiredPermission)) {
      return true;
    }
    
    // Verifica se tem permissão genérica (ex: 'read' para 'read:products')
    const [action, resource] = requiredPermission.split(':');
    if (permissions.effectivePermissions.includes(action)) {
      return true;
    }
    
    // Verifica permissões customizadas
    if (permissions.customPermissions) {
      return permissions.customPermissions.some(permission => 
        permission.action === action && 
        permission.resource === resource && 
        permission.grant === true
      );
    }
    
    return false;
  };

  // Função para verificar se o usuário tem um dos roles especificados
  const hasRole = (requiredRoles: string[]): boolean => {
    if (!permissions?.userRoles) return false;
    return requiredRoles.some(role => permissions.userRoles.includes(role));
  };

  // Função para verificar se o usuário tem acesso a um recurso específico
  const hasResourceAccess = (resource: string, action: string = 'read'): boolean => {
    if (!permissions?.customPermissions) return false;
    
    return permissions.customPermissions.some(permission => 
      permission.resource === resource && 
      permission.action === action && 
      permission.grant === true
    );
  };
  const commonItems = [
    {
      icon: <House color="#484848" size={20} />,
      label: "Início",
      onPress: () => navigation.navigate("Stacks", { screen: "Home" }),
      permission: null, // Sempre visível
    },
    {
      icon: <GitCompareArrows color="#484848" size={20} />,
      label: "Movimentações",
      onPress: () => navigation.navigate("Stacks", { screen: "MoveList" }),
      permission: "read",
    },
    {
      icon: <LayoutGrid color="#484848" size={20} />,
      label: "Produtos",
      onPress: () => navigation.navigate("Stacks", { screen: "ProductList" }),
      permission: "read",
    },
    {
      icon: <LayoutList color="#484848" size={20} />,
      label: "Categorias",
      onPress: () => navigation.navigate("Stacks", { screen: "CategoryList" }),
      permission: "read",
    },
    {
      icon: <Truck color="#484848" size={20} />,
      label: "Fornecedores",
      onPress: () => navigation.navigate("Stacks", { screen: "SupplierList" }),
      permission: "read",
    },
    {
      icon: <Brain color="#484848" size={20} />,
      label: "Inteligência Artificial",
      onPress: () => navigation.navigate("Stacks", { screen: "AI" }),
      permission: "read",
    },
    {
      icon: <Bell color="#484848" size={20} />,
      label: "Notificações",
      onPress: () => navigation.navigate("Stacks", { screen: "NotifyList" }),
      permission: "read",
    },
    {
      icon: <CircleUserRound color="#484848" size={20} />,
      label: "Meu perfil",
      onPress: () => navigation.navigate("Stacks", { screen: "Profile" }),
      permission: null, // Sempre visível
    },
  ];

  const adminLojaItems = [
    {
      icon: <House color="#484848" size={20} />,
      label: "Início",
      onPress: () => navigation.navigate("Stacks", { screen: "Home" }),
      permission: null, // Sempre visível
    },
    {
      icon: <GitCompareArrows color="#484848" size={20} />,
      label: "Movimentações",
      onPress: () => navigation.navigate("Stacks", { screen: "MoveList" }),
      permission: "read",
    },
    {
      icon: <ChartPie color="#484848" size={20} />,
      label: "Relatórios",
      onPress: () => navigation.navigate("Stacks", { screen: "ReportList" }),
      permission: "read",
    },
    {
      icon: <LayoutGrid color="#484848" size={20} />,
      label: "Produtos",
      onPress: () => navigation.navigate("Stacks", { screen: "ProductList" }),
      permission: "read",
    },
    {
      icon: <LayoutList color="#484848" size={20} />,
      label: "Categorias",
      onPress: () => navigation.navigate("Stacks", { screen: "CategoryList" }),
      permission: "read",
    },
    {
      icon: <Truck color="#484848" size={20} />,
      label: "Fornecedores",
      onPress: () => navigation.navigate("Stacks", { screen: "SupplierList" }),
      permission: "read",
    },
    {
      icon: <Brain color="#484848" size={20} />,
      label: "Inteligência Artificial",
      onPress: () => navigation.navigate("Stacks", { screen: "AI" }),
      permission: "read",
    },
    {
      icon: <Bell color="#484848" size={20} />,
      label: "Notificações",
      onPress: () => navigation.navigate("Stacks", { screen: "NotifyList" }),
      permission: "read",
    },
    {
      icon: <CircleUserRound color="#484848" size={20} />,
      label: "Meu perfil",
      onPress: () => navigation.navigate("Stacks", { screen: "Profile" }),
      permission: null, // Sempre visível
    },
  ];

  const superAdminItems = [
    {
      icon: <House color="#484848" size={20} />,
      label: "Início",
      onPress: () => navigation.navigate("Stacks", { screen: "Home" }),
      permission: null, // Sempre visível
    },
    {
      icon: <Store color="#484848" size={20} />,
      label: "Lojas",
      onPress: () => navigation.navigate("Stacks", { screen: "StoreList" }),
      permission: "read",
    },
    {
      icon: <ChartPie color="#484848" size={20} />,
      label: "Relatórios",
      onPress: () => navigation.navigate("Stacks", { screen: "ReportList" }),
      permission: "read",
    },
    {
      icon: <GitCompareArrows color="#484848" size={20} />,
      label: "Movimentações",
      onPress: () => navigation.navigate("Stacks", { screen: "MoveList" }),
      permission: "read",
    },
    {
      icon: <Users color="#484848" size={20} />,
      label: "Usuários",
      onPress: () => navigation.navigate("Stacks", { screen: "UserList" }),
      permission: "read",
    },
    {
      icon: <LayoutGrid color="#484848" size={20} />,
      label: "Produtos",
      onPress: () => navigation.navigate("Stacks", { screen: "ProductList" }),
      permission: "read",
    },
    {
      icon: <LayoutList color="#484848" size={20} />,
      label: "Categorias",
      onPress: () => navigation.navigate("Stacks", { screen: "CategoryList" }),
      permission: "read",
    },
    {
      icon: <Truck color="#484848" size={20} />,
      label: "Fornecedores",
      onPress: () => navigation.navigate("Stacks", { screen: "SupplierList" }),
      permission: "read",
    },
    {
      icon: <Brain color="#484848" size={20} />,
      label: "Inteligência Artificial",
      onPress: () => navigation.navigate("Stacks", { screen: "AI" }),
      permission: "read",
    },
    {
      icon: <Upload color="#484848" size={20} />,
      label: "Importar",
      onPress: () => navigation.navigate("Stacks", { screen: "Import" }),
      permission: "read",
    },
    {
      icon: <Bell color="#484848" size={20} />,
      label: "Notificações",
      onPress: () => navigation.navigate("Stacks", { screen: "NotifyList" }),
      permission: "read",
    },
    {
      icon: <CircleUserRound color="#484848" size={20} />,
      label: "Meu perfil",
      onPress: () => navigation.navigate("Stacks", { screen: "Profile" }),
      permission: null, // Sempre visível
    },
  ];


  // Exemplo de como personalizar permissões específicas
  // Você pode adicionar lógica mais complexa aqui baseada nos dados que recebe
  const hasSpecificPermission = (resource: string, action: string = 'read') => {
    // Verifica permissões customizadas primeiro
    if (permissions?.customPermissions) {
      const customPermission = permissions.customPermissions.find(p => 
        p.resource === resource && p.action === action && p.grant === true
      );
      if (customPermission) return true;
    }

    // Verifica permissões da loja
    if (permissions?.storePermissions) {
      const storePermission = permissions.storePermissions.find(p => 
        p.permissions.includes(action) && p.storeId === permissions.storeId
      );
      if (storePermission) return true;
    }

    // Verifica permissões efetivas genéricas
    return hasPermission(action);
  };

  // Função para filtrar itens baseado nas permissões
  const filterItemsByPermissions = (items: any[]) => {
    return items.filter(item => {
      // Se não tem permissão definida, sempre mostra
      if (!item.permission) return true;
      
      // Verifica se tem a permissão necessária
      return hasPermission(item.permission);
    });
  };

  // Seleciona os itens baseado no role e filtra pelas permissões
  const getMenuItems = () => {
    let items = [];
    
    // Usa os dados das permissões para determinar o role, com fallback para o role do contexto
    const userRole = permissions?.userRoles?.[0] || role;
    
    if (userRole === "regular" || userRole === "user") {
      items = commonItems;
    } else if (userRole === "adminloja" || userRole === "admin") {
      items = adminLojaItems;
    } else if (userRole === "superadmin" || userRole === "super") {
      items = superAdminItems;
    } else {
      // Fallback: se não reconhecer o role, usa os itens comuns
      items = commonItems;
    }
    
    return filterItemsByPermissions(items);
  };

  const account = getMenuItems();

  return (
    <Column ph={20} pv={40} style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollVertical>

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
                  {item?.icon}
                </View>
                <Label>{item?.label}</Label>
              </Row>
              <ChevronRight color="#484848" size={20} />
            </Pressable>
          ))
          }
          <Pressable style={{ paddingVertical: 14, paddingHorizontal: 12, borderRadius: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} onPress={() => logout()}>
            <Row align="center" >
              <View style={{ marginRight: 12 }}>
                <LogOut color="#484848" size={20} />
              </View>
              <Label>Sair</Label>
            </Row>
            <ChevronRight color="#484848" size={20} />
          </Pressable>
        </Column>
      </ScrollVertical>
    </Column>
  );
}

export default CustomDrawerContent;

/*
=== SISTEMA DE PERMISSÕES DO DRAWER ===

Este sistema de permissões funciona da seguinte forma:

1. ESTRUTURA DE DADOS RECEBIDA:
   - effectivePermissions: ['read'] - permissões efetivas do usuário
   - userRoles: ['user'] - roles do usuário
   - customPermissions: [] - permissões customizadas específicas
   - storePermissions: [] - permissões por loja
   - storeId: null - ID da loja atual

2. COMO FUNCIONA:
   - Cada item do menu tem uma propriedade 'permission'
   - Se permission = null, o item sempre aparece
   - Se permission = "read", verifica se o usuário tem permissão 'read'
   - A função hasPermission() verifica effectivePermissions e customPermissions

3. PERSONALIZAÇÃO:
   - Para permissões mais específicas, use hasSpecificPermission(resource, action)
   - Exemplo: hasSpecificPermission('products', 'write')
   - Você pode adicionar lógica baseada nos roles do usuário

4. EXEMPLO DE USO:
   - Usuário com effectivePermissions: ['read'] verá todos os itens com permission: "read"
   - Usuário com effectivePermissions: ['write'] verá itens com permission: "read" e "write"
   - Usuário com customPermissions específicas terá acesso baseado nessas permissões

5. DEBUG:
   - Use debugPermissions() para ver todas as permissões no console
   - Os logs mostram quais itens são filtrados e por quê

6. ADICIONANDO NOVOS ITENS:
   - Adicione a propriedade permission ao item
   - Use "read", "write", "create", "update", "delete" ou null
   - Para permissões específicas, use hasSpecificPermission() na lógica de filtro
*/
