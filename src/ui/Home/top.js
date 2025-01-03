import React, { useState, useEffect } from "react";
import { Column, Row, Title, HeadTitle } from "@/ui/index";
import { useTranslation } from "@hooks/translations";

import { useUser } from "@context/user";
import { Pressable } from "react-native";
import { AlignLeft, AlignRight, Menu } from "lucide-react-native";
import { MotiView } from "moti";
import { SCREEN_WIDTH } from "@theme/global";

export default function TopComponent({ navigation }) {
  const { user } = useUser();
  const { t } = useTranslation();
  const hello = new Date().getHours() < 12 ? t("home.greatings_morning") : new Date().getHours() < 18 ? t("home.greatings_afternoon") : t("home.greatings_evening");

  return (
    <Column mt={24} style={{ flexGrow: 1 }}>
      <Row ph={26} justify="space-between" style={{ width: SCREEN_WIDTH }}>
        <HeadTitle fontFamily="Font_Bold" spacing={-3} size={42}>{hello}</HeadTitle>
        <Pressable style={{ width: 56, height: 56, borderRadius: 100, backgroundColor: "#101010", justifyContent: "center", alignItems: "center" }}
          onPress={() => {
            navigation.openDrawer(); 
          }} 
        >
          <Menu size={24} color="#fff" />
        </Pressable>
      </Row>
    </Column>

  );
}
//{"\n"}{user?.name?.length > 16 ? user?.name.slice(0, 16) + "..." : user?.name}
