import { Column, Title, Label, Row, useTheme } from "@theme/global";
import { useTranslation } from "@hooks/translations";

export default function CommentsEmpty() {
  const { t } = useTranslation();
  const { color } = useTheme();
  return (
    
    <Column style={{ justifyContent: "center", alignItems: "center", marginVertical: 50, marginHorizontal: 20 }}>
      <Column style={{ rowGap: 12, width: 200, marginVertical: 40 }}>
        <Column style={{ width: 100, height: 32, borderBottomLeftRadius: 0, borderRadius: 12, backgroundColor: color.primary, alignSelf: "flex-start" }} />
        <Column style={{ width: 160, height: 32, borderBottomRightRadius: 0, borderRadius: 12, backgroundColor: color.off, alignSelf: "flex-end" }} />
        <Column style={{ width: 160, height: 32, borderBottomRightRadius: 0, borderRadius: 12, backgroundColor: color.off, alignSelf: "flex-end" }} />
        <Column style={{ width: 150, height: 32, borderBottomLeftRadius: 0, borderRadius: 12, backgroundColor: color.primary, alignSelf: "flex-start" }} />
      </Column>

      <Title style={{ textAlign: "center" }} accessibilityLabel={t("comments.empty_title")}>{t("comments.empty_title")}</Title>
      <Label style={{ fontSize: 16, marginVertical: 12, textAlign: "center" }} accessibilityLabel={t("comments.empty_label")}>{t("comments.empty_label")}</Label>
    </Column>
  );
}

