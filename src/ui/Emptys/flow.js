import { Column, Title, Label, Row, useTheme } from "@theme/global";
import { useTranslation } from "@hooks/translations";
import { GalleryVerticalEnd } from "lucide-react-native";

export default function FlowsEmpty() {
  const { t } = useTranslation();
  const { color } = useTheme();
  return (
    <Column style={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingVertical: 100, marginVertical: 15, marginHorizontal: 24 }}>
      <GalleryVerticalEnd size={36} color="#ffffff" />
      <Title style={{ textAlign: "center", marginTop: 12 }}>Nada por aqui...</Title>
      <Label size={16} style={{ marginTop: 6, textAlign: "center" }}>Começe a adicionar ao ler um mangá! Clique na engrenagem e em adicionar ao Flow, escolha a página e salve. </Label>
    </Column>
  ); 
};
