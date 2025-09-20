import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = '@theme_mode';

export const useTheme = () => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o tema salvo do AsyncStorage
  const loadTheme = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        const themeMode = savedTheme as ThemeMode;
        setMode(themeMode);
      }
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salva o tema no AsyncStorage
  const saveTheme = useCallback(async (themeMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  }, []);

  // Alterna entre tema light e dark
  const toggleTheme = useCallback(async () => {
    const newMode: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    await saveTheme(newMode);
  }, [mode, saveTheme]);

  // Define um tema específico
  const setThemeMode = useCallback(async (themeMode: ThemeMode) => {
    setMode(themeMode);
    await saveTheme(themeMode);
  }, [saveTheme]);

  // Verifica se o tema atual é dark
  const isDark = mode === 'dark';

  // Verifica se o tema atual é light
  const isLight = mode === 'light';

  // Carrega o tema na inicialização
  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  return {
    mode,
    isLoading,
    isDark,
    isLight,
    toggleTheme,
    setThemeMode
  };
};
