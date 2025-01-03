import { useContext } from "react";
import { ThemeContext } from "styled-components/native";

export const useTheme = () => {
    const { color, font, margin } = useContext(ThemeContext);
    return { color, font, margin };
}