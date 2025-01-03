import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import { Column, Title } from "@/ui";
import { LinearGradient } from "expo-linear-gradient";

export const WallItem = ({ item }) => {
  if (!item) return null;
  const navigation = useNavigation();
  const { name, capa, id } = item;
  const HeightValue = 200;
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("ShopPinterest", { item: item, id: id  });
      }}
      style={{
        flexGrow: 1,
        marginHorizontal: 8,
        marginVertical: 8
      }}
    >
      <Image
        source={{ uri: capa }}
        style={{
          height: HeightValue,
          borderRadius: 24,
          width: "100%"
        }}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
      />
      <Column style={{ position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 2 }}>
        <Title size={20} style={{ width: 160 }}>{name}</Title>
      </Column>
      <LinearGradient
        style={{ flexGrow: 1, height: 70, position: "absolute", bottom: -5, left: 0, right: 0 }}
        colors={["#00000000", "#00000090", "#00000099"]}
      />
    </Pressable>
  );
};
