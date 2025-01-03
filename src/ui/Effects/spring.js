import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const FooterSpring = ({
  initialHeight = 50,
  maxHeight = 150,
  initialColor = "#f0f0f0",
  endColor = "#a0c4ff",
  style
}) => {
  const height = useSharedValue(initialHeight); // Altura inicial
  const translateY = useSharedValue(0); // Controle para o deslocamento vertical

  // Estilo animado para altura e cor
  const animatedStyle = useAnimatedStyle(() => ({
    paddingTop: height.value,
    transform: [{ translateY: translateY.value }],
    backgroundColor: interpolateColor(
      height.value,
      [initialHeight, maxHeight],
      [initialColor, endColor]
    )
  }));

  // Gesto para manipular a altura e movimento para cima
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        // Se puxar para cima, aumenta a altura
        const newHeight = initialHeight - event.translationY;
        if (newHeight <= maxHeight) {
          height.value = newHeight;
          translateY.value = event.translationY / 2; // Move para cima suavemente
        }
      }
    })
    .onEnd(() => {
      // Volta ao estado inicial com efeito spring ao soltar
      height.value = withSpring(initialHeight, {
        damping: 10,
        stiffness: 100
      });
      translateY.value = withSpring(0, {
        damping: 10,
        stiffness: 100
      });
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.footerContainer, animatedStyle, style]}>
        <Text style={styles.footerText}>Puxe para cima!</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default FooterSpring;

const styles = StyleSheet.create({
  listContent: {
    padding: 16
  },
  itemContainer: {
    padding: 16,
    backgroundColor: "#eee",
    marginVertical: 8,
    borderRadius: 8
  },
  itemText: {
    fontSize: 16,
    color: "#333"
  },
  footerContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 16
  },
  footerText: {
    fontSize: 16,
    color: "#fff"
  }
});
