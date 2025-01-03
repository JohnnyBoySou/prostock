import { Column, Title, Label, Row, useTheme } from "@theme/global";
import { useTranslation } from "@hooks/translations";
import { MotiView } from "moti";

export default function MarkersEmpty() {
  const { t } = useTranslation();
  const { color } = useTheme();
  return (
    <Column style={{ justifyContent: "center", alignItems: "center", marginTop: 10, paddingVertical: 30, paddingHorizontal: 30 }}>
      <Row style={{ columnGap: 12 }}>
        <MotiView style={{ width: 90, height: 90, backgroundColor: "#303030", borderRadius: 12 }} accessibilityLabel="Empty marker 1"/>
        <MotiView style={{ width: 90, height: 90, backgroundColor: "#303030", borderRadius: 12 }} accessibilityLabel="Empty marker 2"/>
      </Row>
      <Row style={{ columnGap: 12, marginVertical: 12 }}>
        <MotiView style={{ width: 90, height: 90, backgroundColor: "#303030", borderRadius: 12 }} accessibilityLabel="Empty marker 3"/>
        <MotiView style={{ width: 90, height: 90, backgroundColor: color.primary, borderRadius: 12 }} accessibilityLabel="Primary color marker"/>
        <MotiView style={{ width: 90, height: 90, backgroundColor: "#303030", borderRadius: 12 }} accessibilityLabel="Empty marker 4"/>
      </Row>
      <Title style={{ fontSize: 24, marginTop: 8, textAlign: "center" }} accessibilityLabel={t("markers.empty_markers_title")}>{t("markers.empty_markers_title")}</Title>
      <Label style={{ textAlign: "center", fontSize: 16, marginTop: 6 }} accessibilityLabel={t("markers.empty_markers_label")}>{t("markers.empty_markers_label")}</Label>
    </Column>
  );
}
