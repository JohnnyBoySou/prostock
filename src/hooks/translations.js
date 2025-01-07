import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultLanguage = "pt-br";

export const useTranslation = () => {
  const [language, setLanguage] = useState(defaultLanguage);
  const [translations, setTranslations] = useState(null);

  // Função para carregar as traduções dinamicamente com base no idioma
  const loadTranslations = async(lang) => {
    try {
      let translations;
      switch (lang) {
      case "en":
        translations = await import("@assets/translations/en.json");
        break;
      case "pt-br":
        translations = await import("@assets/translations/pt.json");
        break;
      case "es":
        translations = await import("@assets/translations/es.json");
        break;
      default:
        translations = await import("@assets/translations/pt.json"); // fallback
        break;
      }
      setTranslations(translations.default); // Acessa as traduções
    } catch (error) {
      console.error("Erro ao carregar traduções:", error);
    }
  }; 

  // Carregar idioma salvo do AsyncStorage (persistência)
  useEffect(() => {
    const loadLanguage = async() => {
      const savedLanguage = await AsyncStorage.getItem("language") || defaultLanguage;
      setLanguage(savedLanguage);
      loadTranslations(savedLanguage); // Carrega as traduções do idioma salvo
    };
    loadLanguage();
  }, []);

  const changeLanguage = async(lang) => {
    if (lang !== language) {
      setLanguage(lang);
      await AsyncStorage.setItem("language", lang); // Persistir idioma escolhido
      loadTranslations(lang); // Carregar as traduções ao mudar o idioma
    }
  };

  const t = (key) => {
    if (!translations) return key;
    return key.split(".").reduce((obj, i) => (obj ? obj[i] : key), translations);
  };

  const avaliableLanguages = [{ name: "Português - Brasil", id: "pt-br" }, { name: "English", id: "en" }, { name: "Español", id: "es" }];
  return { t, changeLanguage, language, avaliableLanguages };
};
