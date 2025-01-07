import { ChevronLeft, Forward } from "lucide-react-native";
import { View, Pressable, Text } from "react-native";

export default function StackMenu({ navigation, bg, name }) {
  return (
    <View style={{ alignItems: "center",  flexDirection: "row", paddingTop: 50, paddingHorizontal: 26, paddingBottom: 16, flexGrow: 1, backgroundColor: '#FFF', }}>
      <Pressable onPress={() => {
        navigation.goBack();
      }} style={{ width: 42, height: 42, justifyContent: "center", alignItems: "center", borderRadius: 100, backgroundColor: '#EDF0F1', }} >
        <ChevronLeft size={24} color="#202020" />
          </Pressable>
      <Text style={{ fontFamily: 'Font_Medium', color: '#1E1E1E', fontSize: 22, marginLeft: 12 }}>{name}</Text>
    </View>
  );
}
