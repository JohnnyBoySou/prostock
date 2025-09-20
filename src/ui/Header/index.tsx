import { ChevronLeft, Forward } from "lucide-react-native";
import { View, Pressable, Text } from "react-native";
import { colors } from "@/ui";

export default function StackMenu({ navigation, name }: { navigation: any, name: string }) {
  const theme = colors();
  return (
    <View style={{ alignItems: "center", flexDirection: "row", paddingTop: 50, paddingHorizontal: 26, paddingBottom: 16, flexGrow: 1, backgroundColor: theme.color.header, }}>
      <Pressable onPress={() => {
        navigation.goBack();
      }} style={{ width: 42, height: 42, justifyContent: "center", alignItems: "center", borderRadius: 100, backgroundColor: theme.color.background, }} >
        <ChevronLeft size={24} color={theme.color.text} />
      </Pressable>
      <Text style={{ fontFamily: 'Font_Medium', color: theme.color.text, fontSize: 22, marginLeft: 12 }}>{name}</Text>
    </View>
  );
}
