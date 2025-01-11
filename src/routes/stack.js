import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import Minimal from "@/ui/Header/minimal";
import StackMenu from "@/ui/Header";
import { useUser } from "@/context/user";

const Stack = createStackNavigator();

import HomeScreen from "@/screens/stack/home";

import ProductSuccessScreen from "@/screens/stack/product/success";
import ProductAddScreen from "@/screens/stack/product/add";
import ProductListScreen from "@/screens/stack/product/list";
import ProductEditScreen from '@/screens/stack/product/edit';

import CategoryAddScreen from "@/screens/stack/category/add";
import CategoryEditScreen from "@/screens/stack/category/edit";

import UserAddScreen from "@/screens/stack/user/add";
import UserListScreen from "@/screens/stack/user/list";
import UserEditScreen from "@/screens/stack/user/edit";

import StoreAddScreen from "@/screens/stack/store/add";
import StoreListScreen from "@/screens/stack/store/list";
import StoreEditScreen from "@/screens/stack/store/edit";

import SupplierAddScreen from "@/screens/stack/supplier/add";
import SupplierListScreen from "@/screens/stack/supplier/list";
import SupplierEditScreen from "@/screens/stack/supplier/edit";

import MoveAddScreen from "@/screens/stack/move/add";
import MoveListScreen from "@/screens/stack/move/list";
import MoveEditScreen from "@/screens/stack/move/edit";

import AIScreen from "@/screens/stack/ai";

import ReportListScreen from "@/screens/stack/report/list";
import ReportSingleScreen from "@/screens/stack/report/single";
import ReportProductScreen from '@/screens/stack/report/product';

import OCRTesseractScreen from "@/screens/stack/ai/tesseract";
import OCRScreen from "@/screens/stack/ai/google";

export function Stacks() {

  const { role } = useUser();

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ ...TransitionPresets.SlideFromRightIOS }} />


      <Stack.Group>
        <Stack.Screen name="AI" component={AIScreen} options={{ header: ({ navigation, }) => (<Minimal navigation={navigation} scene="AI" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="OCR" component={OCRScreen} options={{ header: ({ navigation, }) => (<Minimal navigation={navigation} scene="OCR" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="OCRTesseract" component={OCRTesseractScreen} options={{ header: ({ navigation, }) => (<Minimal navigation={navigation} scene="OCR Tesseract" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="ReportList" component={ReportListScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Listar relatórios" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="ReportSingle" component={ReportSingleScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Relatório" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="ReportProduct" component={ReportProductScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Relatório de produtos" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="ProductSuccess" component={ProductSuccessScreen} options={{ header: ({ navigation, }) => (<Minimal navigation={navigation} scene="Criar conta" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="ProductAdd" component={ProductAddScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Criar produto" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="ProductList" component={ProductListScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Listar produtos" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="ProductEdit" component={ProductEditScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Editar produto" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="CategoryAdd" component={CategoryAddScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Criar categoria" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="CategoryEdit" component={CategoryEditScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Editar categoria" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="SupplierAdd" component={SupplierAddScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Criar fornecedor" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="SupplierList" component={SupplierListScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Listar fornecedores" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="SupplierEdit" component={SupplierEditScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Editar fornecedor" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen name="MoveAdd" component={MoveAddScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Criar movimentação" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="MoveList" component={MoveListScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Listar movimentações" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="MoveEdit" component={MoveEditScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Editar movimentação" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
      </Stack.Group>

      {role === 'superadmin' && (
        <Stack.Group>
          <Stack.Group>
            <Stack.Screen name="UserAdd" component={UserAddScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Criar usuário" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
            <Stack.Screen name="UserList" component={UserListScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Listar usuários" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
            <Stack.Screen name="UserEdit" component={UserEditScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Editar usuário" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
          </Stack.Group>
          <Stack.Group>
            <Stack.Screen name="StoreAdd" component={StoreAddScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Criar loja" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
            <Stack.Screen name="StoreList" component={StoreListScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Listar lojas" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
            <Stack.Screen name="StoreEdit" component={StoreEditScreen} options={{ header: ({ navigation, }) => (<StackMenu navigation={navigation} name="Editar loja" />), headerShown: true, ...TransitionPresets.SlideFromRightIOS }} />
          </Stack.Group>
        </Stack.Group>
      )}

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