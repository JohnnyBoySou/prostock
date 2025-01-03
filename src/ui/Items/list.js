import { Column, Title } from "@/ui";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const ListCard = ({ item }) => {
  const { name, capa, id } = item;

  const navigation = useNavigation();  
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const handlePressIn = () => {
    scale.value = withSpring(0.90, { damping: 10, stiffness: 150 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Feedback tátil
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 150 });
  };
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("MangaSingle", { id: id }); 
      }}
      onLongPress={handlePressIn}
      delayLongPress={300}
      onPressOut={handlePressOut}
      style={{ flexGrow: 1, height: 224, borderRadius: 24, overflow: "hidden" }}>
      <Animated.View
        style={[
          {
            flexGrow: 1,
            height: 224,
            borderRadius: 24,
            overflow: "hidden"
          },
          animatedStyle
        ]}
      >
        <Image source={{ uri: capa }} transition={200} style={{ width: 164, height: 224, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} />
        <Column style={{ position: "absolute", bottom: 20, left: 20, right: 20, zIndex: 2 }}>
          <Title size={20} style={{ width: 140 }}>{name}</Title>
        </Column>
        <LinearGradient
          style={{ width: 164, height: 100, position: "absolute", bottom: -5, left: 0, right: 0 }}
          colors={["#00000020", "#00000090", "#00000099"]}
        />
      </Animated.View>
    </Pressable>
  );
};
  
export default ListCard;
