import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import Minimal from "@/ui/Header/minimal";
import StackMenu from "@/ui/Header";

const Stack = createStackNavigator();

import HomeScreen from "@/screens/stack/home";

import ProductSuccessScreen from "@/screens/stack/product/success";
import ProductAddScreen from "@/screens/stack/product/add";
import ProductListScreen from "@/screens/stack/product/list";

export function Stacks() {
  return (
    <Stack.Navigator initialRouteName="ProductSuccess" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductSuccess" component={ProductSuccessScreen} options={{ header: ({ navigation,  }) => (<Minimal navigation={navigation} scene="Criar conta" />), headerShown: true,}} />
      <Stack.Screen name="ProductAdd" component={ProductAddScreen} options={{ header: ({ navigation,  }) => (<StackMenu navigation={navigation} name="Criar produto" />),headerShown: true,}} />
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ header: ({ navigation,  }) => (<StackMenu navigation={navigation} name="Listar produtos" />), headerShown: true,}} />
     
      <Stack.Screen name="Home" component={HomeScreen} options={{ ...TransitionPresets.SlideFromRightIOS }} />
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