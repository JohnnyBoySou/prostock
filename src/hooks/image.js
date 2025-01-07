import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultSettings = {
  minScale: 1,
  maxScale: 5,
  scale: 1,
  doubleTapScale: 3,
  isSingleTapEnabled: true,
  isDoubleTapEnabled: true,
  resizeMode: "cover"
};

// Carregar configurações salvas ou usar padrões
export const loadSettings = async() => {
  try {
    const settings = await AsyncStorage.getItem("imageViewSettings");
    return settings ? JSON.parse(settings) : defaultSettings;
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    return defaultSettings;
  }
};

// Salvar configurações
export const saveSettings = async(settings) => {
  try {
    await AsyncStorage.setItem("imageViewSettings", JSON.stringify(settings));
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
  }
};
