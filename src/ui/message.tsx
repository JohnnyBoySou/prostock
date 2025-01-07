import React, { useEffect } from "react";
import { Text } from "react-native";
import { Column, Row } from "./layout";
import { Check, X } from "lucide-react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";

interface MessageProps {
  success?: string;
  error?: string;
}

const Message: React.FC<MessageProps> = ({ success, error }) => {
  const selectColor = success ? "#00c48c" : "#ff3d71";

  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const height = useSharedValue(72);
  const pressed = useSharedValue(false);

  useEffect(() => {
    offset.value = 0;
    opacity.value = 1;
    height.value = 72;
  }, [success, error]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((event) => {
      offset.value = event.translationX;
    })
    .onFinalize(() => {
      if (offset.value > 200) {
        opacity.value = withSpring(0, { damping: 20, stiffness: 100 }, () => {
          height.value = withSpring(0, { damping: 20, stiffness: 100 });
        });
      } else {
        offset.value = withSpring(0);
      }
      pressed.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
      opacity: opacity.value,
      height: height.value,
      backgroundColor: selectColor,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 4,
      marginLeft: 0,
      marginRight: 0
    };
  });

  if (!success && !error) return null;

  return (
    <Row style={{ backgroundColor: selectColor, borderRadius: 12, }} pv={12} >
      <Column justify="center" align="center" style={{ width: 32, height: 32, borderRadius: 100, backgroundColor: "#ffffff40", alignSelf: "center" }} mh={12}>
        {success && <Check size={24} color="#fff" />}
        {error && <X size={24} color="#fff" />}
      </Column>
      <Text style={{ fontSize: 14, width: 220, marginVertical: 12, color: "#fff", lineHeight: 16, fontFamily: "Font_Medium", marginRight: 12 }}>
        {success || error}
      </Text>
    </Row>

  );
};

export default Message;
