import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Main, Image, colors } from '@/ui';
import { useUser } from '@/context/user';

const { width, height } = Dimensions.get('window');

export default function AsyncStaticScreen({ navigation }) {
  const { isSignedIn } = useUser();

  // Valores animados
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const fadeOutOpacity = useSharedValue(1);

  const navigateToNextScreen = () => {
    if (isSignedIn) {
      navigation.replace('Drawer');
    } else {
      navigation.replace('Onboarding');
    }
  };

  useEffect(() => {
    // Animação de entrada do fundo
    backgroundOpacity.value = withTiming(1, { duration: 500 });

    // Sequência de animações do logo
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    logoScale.value = withDelay(
      300,
      withSpring(1, {
        damping: 8,
        stiffness: 100,
      })
    );

    // Rotação sutil do logo
    logoRotation.value = withDelay(
      800,
      withTiming(360, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Pulso contínuo (worklet)
    const pulseAnimation = () => {
      'worklet';
      pulseScale.value = withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      );
    };

    // Iniciar pulso
    const pulseInterval = setInterval(() => {
      pulseAnimation();
    }, 2000);

    // Animação de saída e navegação
    const exitAnimation = () => {
      'worklet';
      fadeOutOpacity.value = withTiming(
        0,
        {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        },
        () => {
          runOnJS(navigateToNextScreen)();
        }
      );
    };

    // Iniciar animação de saída após 4 segundos
    const exitTimeout = setTimeout(() => {
      exitAnimation();
    }, 4000);

    return () => {
      clearInterval(pulseInterval);
      clearTimeout(exitTimeout);
    };
  }, [isSignedIn]);

  // Estilos animados
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value * pulseScale.value },
      { rotate: `${logoRotation.value}deg` },
    ] as any,
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value * fadeOutOpacity.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeOutOpacity.value,
  }));

  const theme = colors();
  
  return (
    <Animated.View style={[{ flex: 1 }, containerAnimatedStyle]}>
      <Main
        style={{
          backgroundColor: theme.color.primary,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Fundo animado */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: width * 1.5,
              height: height * 1.5,
              backgroundColor: theme.color.primary,
              borderRadius: width,
              opacity: 0.1,
            },
            backgroundAnimatedStyle,
          ]}
        />

        {/* Logo animado */}
        <Animated.View style={logoAnimatedStyle}>
          <Image src={require('@/imgs/logo.png')} w={120} h={120} />
        </Animated.View>
      </Main>
    </Animated.View>
  );
}
