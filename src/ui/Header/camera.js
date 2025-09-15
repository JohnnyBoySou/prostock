import { ChevronLeft, Forward } from "lucide-react-native";
import { View, Pressable, Text } from "react-native";

export default function Camera({ navigation, }) {
  return (
    <View style={{ alignItems: "center", flexDirection: "row",  marginHorizontal: 26, paddingBottom: 0, flexGrow: 1, height: 90, position: 'absolute', top: 30 }}>
      <Pressable onPress={() => {
        navigation.goBack();
      }} style={{ width: 42, height: 42, justifyContent: "center", alignItems: "center", borderRadius: 100, backgroundColor: '#FFFFFF', }} >
        <ChevronLeft size={24} color="#202020" />
      </Pressable>
    </View>
  );
}
