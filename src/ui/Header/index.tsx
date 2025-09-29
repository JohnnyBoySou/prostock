import { ChevronLeft, } from "lucide-react-native";
import { colors, Column, Label, Row, Title, Pressable } from "@/ui";

export default function StackMenu({ navigation, name, description }: { navigation: any, name: string, description?: string }) {
  const theme = colors();
  return (
    <Row ph={26} gh={12} style={{ alignItems: "center", paddingTop: 46, paddingBottom: 16,  flexGrow: 1, backgroundColor: theme.color.header, }}>
      <Pressable onPress={() => {
        navigation.goBack();
      }} style={{ width: 42, height: 42, justifyContent: "center", alignItems: "center", borderRadius: 100, backgroundColor: theme.color.foreground, }} >
        <ChevronLeft size={24} color={theme.color.text} />
      </Pressable>
      <Column
      >
        <Title size={24} fontFamily='Font_Medium' spacing={-1}>{name}</Title>
        {description && (
          <Label size={12} >{description}</Label>
        )}
      </Column>
    </Row>
  );
}
