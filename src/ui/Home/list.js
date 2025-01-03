import { useTranslation } from "@hooks/translations";
import { listMangasAll, listMangasWeekend, listMangasTop, listMangasNew } from "@/api/manga";

import { Column, Row, Title, Label } from "../index";
import { useQuery } from "@tanstack/react-query"; // Importando o hook useQuery do React Query
import { Pressable } from "react-native";
import { ChevronRight, Search } from "lucide-react-native";

import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";

import MangaCard from "@/ui/Items/manga";
import MangaHight from "@/ui/Items/highlight";

export default function ListMangas() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data: all, isLoading: loadingAll } = useQuery({
    queryKey: ["all"],
    queryFn: async() => {
      const res = await listMangasAll(); return res;
    }
  });
  const { data: weekend, isLoading: loadingWeekend } = useQuery({
    queryKey: ["weekend"],
    queryFn: async() => {
      const res = await listMangasWeekend(); return res;
    }
  });
  const { data: top, isLoading: loadingTop } = useQuery({
    queryKey: ["top"],
    queryFn: async() => {
      const res = await listMangasTop(); return res;
    }
  });

  const { data: news, isLoading: loadingNew } = useQuery({
    queryKey: ["new"],
    queryFn: async() => {
      const res = await listMangasNew(); return res;
    }
  });


  return (
    <Column>
      <Pressable style={{ backgroundColor: "#191919", borderWidth: 1.5, borderColor: "#242424", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 16, marginHorizontal: 26, marginVertical: 20 }}>
        <Row align="center" justify="space-between">
          <Title size={18} fontFamily="Font_Book" color="#b2b2b2">Buscar mangá</Title>
          <Search size={24} color="#B2B2B2" />
        </Row>
      </Pressable>

      <Column gv={16} mb={32}>
        <Pressable onPress={() => {
          navigation.navigate("List", { name: t("lists.most_viewed"), data: all });
        }} >
          <Row align="center" mh={26}>
            <Column pv={4} ph={4} style={{ borderWidth: 2, borderColor: "#FFEF78", borderRadius: 100, alignSelf: "flex-start" }}>
              <Column style={{ backgroundColor: "#FFEF78", width: 38, height: 38, justifyContent: "center", alignItems: "center", borderRadius: 100 }}>
                <Label align="center">🎉</Label>
              </Column>
            </Column>
            <Column ml={12}>
              <Row style={{ alignItems: "center" }}>
                <Title fontFamily="Font_Medium" size={24} >{t("lists.most_viewed")}</Title>
                <ChevronRight size={20} color="#B2B2B2" />
              </Row>
              <Label>Coisa nova toda sexta-feira</Label>
            </Column>
          </Row>
        </Pressable>
        <FlashList
          data={news}
          renderItem={({ item }) => <MangaHight item={item} />}
          estimatedItemSize={214}
          estimatedListSize={{ height: 268, width: 214 }}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 26 }}
          ItemSeparatorComponent={() => <Column style={{ width: 12, height: 20 }} />}
        />
      </Column>

      <ListFlat data={weekend} title="Melhores da semana"/>
      <ListFlat data={top} title="Mais vistos"/>

    </Column>
  );
}


const ListFlat = ({ data, title }) => {
  const navigation = useNavigation();
  return (
    <Column gv={16}>
      <Pressable onPress={() => {
        navigation.navigate("List", { name: title, data: data });
      }} >
        <Row style={{ alignItems: "center" }} mh={26}>
          <Title fontFamily="Font_Medium" size={24} >{title}</Title>
          <ChevronRight size={20} color="#B2B2B2" />
        </Row>
      </Pressable>
      <FlashList
        data={data}
        renderItem={({ item }) => <MangaCard item={item} />}
        estimatedItemSize={214}
        estimatedListSize={{ height: 268, width: 214 }}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 26 }}
        ItemSeparatorComponent={() => <Column style={{ width: 12, height: 20 }} />}
      />
    </Column>
  );
};
