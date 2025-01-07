import { useContext } from "react";
import { ThemeContext } from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useTheme = () => {
  const { color, font, margin } = useContext(ThemeContext);
  return { color, font, margin };
};

export const getTheme = async() => {
  try {
    const thema = JSON.parse(await AsyncStorage.getItem("@thema"));
    if (thema.length > 1) {
      return thema;
    } else {
      await createTheme({ theme: "dark" });
      return { theme: "dark" };
    }
  } catch (error) {
    console.error("Error getting preferences:", error);
    return [];
  }
};

export const createTheme = async(thema) => {
  try {
    await AsyncStorage.setItem("@thema", JSON.stringify(thema));
    return true;
  } catch (error) {
    console.error("Error creating preference:", error);
    return false;
  }
};

export const editTheme = async(updatedThema) => {
  try {
    await AsyncStorage.setItem("@thema", JSON.stringify(updatedThema));
    const res = await getTheme();
    return true;
  } catch (error) {
    console.error("Error editing preferences:", error);
    return false;
  }
};
