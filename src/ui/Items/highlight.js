import { Pressable } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

import * as Haptics from "expo-haptics";
import { Column, Row, Title, Label, Skeleton } from "@/ui";
import { Plus, Send } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const MangaHight = ({ item }) => {
  const { name, capa, id } = item;
  
  // Shared value para escala
  const scale = useSharedValue(1);
  
  const navigation = useNavigation();
  // Estilo animado
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  // Funções de animação
  const handlePressIn = () => {
    scale.value = withSpring(0.90, { damping: 10, stiffness: 150 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Feedback tátil
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 150 });
  };
  return (
    <Pressable
      onLongPress={handlePressIn}
      onPress={() => {
        navigation.navigate("MangaSingle", { id: id }); 
      }}
      delayLongPress={300}
      onPressOut={handlePressOut}
      style={{ width: 214, height: 268, borderRadius: 24, overflow: "hidden" }}>
      <Animated.View
        style={[
          {
            width: 214,
            height: 268,
            borderRadius: 24,
            overflow: "hidden"
          },
          animatedStyle
        ]}
      >
        <Image source={{ uri: capa }} transition={200} style={{ width: 214, height: 268, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
        <Column style={{ position: "absolute", bottom: 20, left: 20, right: 20, zIndex: 2 }}>
          <Title size={24} style={{ width: 170 }}>{name}</Title>
          <Row gh={6} mt={10}>
            <Pressable style={{ paddingVertical: 10, backgroundColor: "#FFFFFF", paddingHorizontal: 10, borderRadius: 12, flexDirection: "row", gap: 4 }}>
              <Plus size={14} color="#000" />
              <Label size={14} color="#000">Salvar</Label>
            </Pressable>
            <Pressable style={{ borderRadius: 12, flexDirection: "row", gap: 4, overflow: "hidden" }}>
              <BlurView intensity={50} tint="light" style={{ flexDirection: "row", backgroundColor: "#ffffff0", paddingVertical: 10, paddingHorizontal: 10, gap: 4 }}>
                <Send size={14} color="#fff" />
                <Label size={14} color="#fff">Hypar</Label>
              </BlurView>
            </Pressable>
          </Row>
        </Column>
        <LinearGradient
          style={{ width: 214, height: 120, position: "absolute", bottom: -5, left: 0, right: 0 }}
          colors={["#00000020", "#00000090", "#00000099"]}
        />
      </Animated.View>
    </Pressable>
  );
};
export default MangaHight;
