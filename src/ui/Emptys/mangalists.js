import { Column, Title, Label, Row, useTheme } from "@theme/global";
import { useTranslation } from "@hooks/translations";
import Skeleton from "@ui/skeleton";

export default function MangalistsEmpty() {
  const { t } = useTranslation();
  return (
    <Column style={{ justifyContent: "center", alignItems: "center", marginTop: 10, paddingVertical: 30, paddingHorizontal: 30 }}>
      <Row style={{ columnGap: 12, marginVertical: 12 }}>
        <Skeleton style={{ width: 90, height: 120, backgroundColor: "#303030", borderRadius: 12 }} accessibilityLabel="Empty mangalists 3"/>
        <Skeleton style={{ width: 90, height: 120, backgroundColor: "#505050", borderRadius: 12 }} accessibilityLabel="Primary color mangalists"/>
        <Skeleton style={{ width: 90, height: 120, backgroundColor: "#707070", borderRadius: 12 }} accessibilityLabel="Empty mangalists 4"/>
      </Row>
      <Title style={{ fontSize: 24, marginTop: 8, textAlign: "center" }} accessibilityLabel={t("mangalists.empty_mangalists_title")}>{t("mangalists.empty_mangalists_title")}</Title>
      <Label style={{ textAlign: "center", fontSize: 16, marginTop: 6 }} accessibilityLabel={t("mangalists.empty_mangalists_label")}>{t("mangalists.empty_mangalists_label")}</Label>
    </Column>
  );
}
