import React from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { useNavigation, NavigationProp, StackActions } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

interface RootStackParamList {
  [key: string]: object | undefined;
}

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'outline' | 'primary' | 'blur' | 'light';
  style?: ViewStyle;
  textStyle?: TextStyle;
  route?: string;
  routeType?: 'navigate' | 'push' | 'replace';
  params?: Record<string, any>;
  loading?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'default',
  style,
  textStyle,
  route,
  routeType = 'navigate',
  params = {},
  loading = false, 
  icon,
  disabled,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Estilos do contêiner
  const containerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 54,
    paddingHorizontal: 16,
    ...(variant === 'default' && { backgroundColor: '#019866' }),
    ...(variant === 'secondary' && { backgroundColor: '#000' }),
    ...(variant === 'destructive' && { backgroundColor: '#ff4d4d' }),
    ...(variant === 'ghost' && { backgroundColor: '#01986630' }),
    ...(variant === 'link' && { backgroundColor: 'transparent' }),
    ...(variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#019866' }),
    ...(variant === 'primary' && { backgroundColor: '#787878' }),
    ...(variant === 'light' && { backgroundColor: '#fff' }),
    ...(variant === 'blur' && {}),
    ...(style || {}),
  };

  // Estilos do texto
  const textStyles: TextStyle = {
    textAlign: 'center',
    fontFamily: variant === 'link' ? 'Font_Book' : 'Font_Medium', // Fonte do texto
    color: variant === 'blur' ? '#ffffff' : 
           variant === 'default' ? '#fff' :
           variant === 'secondary' ? '#FFF' :
           variant === 'destructive' ? '#ffffff' :
           variant === 'ghost' ? '#019866' :
           variant === 'link' ? '#787878' :
           variant === 'outline' ? '#019866' :
           variant === 'primary' ? '#ffffff' :
           variant === 'light' ? '#000000' : '#000000', // Cor do texto para cada variante
    fontSize: variant === 'link' ? 18 : 20,
    textDecorationLine: variant === 'link' ? 'underline' : 'none',
    textDecorationStyle: variant === 'link' ? 'solid' : 'solid',
    marginTop: -4,
    ...(textStyle || {}),
  };

  // Função de navegação
  const handleNavigation = () => {
    if (onPress) {
      onPress();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } else if (route) {
      switch (routeType) {
        case 'navigate':
          navigation.navigate(route as string, params);
          break;
        case 'push':
          navigation.dispatch(StackActions.push(route as string, params));
          break;
        case 'replace':
          navigation.dispatch(StackActions.replace(route as string, params));
          break;
        default:
          navigation.navigate(route as string, params);
      }
    }
  };

  // Renderiza o botão com ou sem efeito de blur
  if (variant === 'blur') {
    return (
        <TouchableOpacity
          onPress={handleNavigation}
          accessible={true}
          accessibilityLabel={label}
          accessibilityRole="button"
          disabled={loading || disabled}
          style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          {loading ? <ActivityIndicator color="#000" size={18} /> :
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',  }}>
              {icon ? <View style={{ marginRight: 6, }}>{icon}</View> : null}
            <Text style={textStyles}>{label}</Text>
          </View>
          }
        </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={handleNavigation}
      disabled={loading || disabled}
      accessible={true}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {loading ? <ActivityIndicator color="#FFF" size={24} /> : 
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
          {icon ? <View style={{ marginRight: 6, }}>{icon}</View> : null}
       <Text style={textStyles}>{label}</Text>
     </View>}
    </TouchableOpacity>
  );
};

export default Button;
