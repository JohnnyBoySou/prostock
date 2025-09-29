import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TutorialStatus = 'not_started' | 'in_progress' | 'completed';

const TUTORIAL_STORAGE_KEY = '@tutorial_status';

export const useTutorial = () => {
  const [status, setStatus] = useState<TutorialStatus>('not_started');
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o status do tutorial salvo do AsyncStorage
  const loadTutorialStatus = useCallback(async () => {
    try {
      const savedStatus = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
      if (savedStatus) {
        const tutorialStatus = savedStatus as TutorialStatus;
        setStatus(tutorialStatus);
      }
    } catch (error) {
      console.error('Erro ao carregar status do tutorial:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salva o status do tutorial no AsyncStorage
  const saveTutorialStatus = useCallback(async (tutorialStatus: TutorialStatus) => {
    try {
      await AsyncStorage.setItem(TUTORIAL_STORAGE_KEY, tutorialStatus);
    } catch (error) {
      console.error('Erro ao salvar status do tutorial:', error);
    }
  }, []);

  // Inicia o tutorial
  const startTutorial = useCallback(async () => {
    setStatus('in_progress');
    await saveTutorialStatus('in_progress');
  }, [saveTutorialStatus]);

  // Completa o tutorial
  const completeTutorial = useCallback(async () => {
    setStatus('completed');
    await saveTutorialStatus('completed');
  }, [saveTutorialStatus]);

  // Reseta o tutorial
  const resetTutorial = useCallback(async () => {
    setStatus('not_started');
    await saveTutorialStatus('not_started');
  }, [saveTutorialStatus]);

  // Define um status específico do tutorial
  const setTutorialStatus = useCallback(async (tutorialStatus: TutorialStatus) => {
    setStatus(tutorialStatus);
    await saveTutorialStatus(tutorialStatus);
  }, [saveTutorialStatus]);

  // Verifica se o tutorial não foi iniciado
  const isNotStarted = status === 'not_started';

  // Verifica se o tutorial está em progresso
  const isInProgress = status === 'in_progress';

  // Verifica se o tutorial foi completado
  const isCompleted = status === 'completed';

  // Carrega o status do tutorial na inicialização
  useEffect(() => {
    loadTutorialStatus();
  }, [loadTutorialStatus]);

  return {
    status,
    isLoading,
    isNotStarted,
    isInProgress,
    isCompleted,
    startTutorial,
    completeTutorial,
    resetTutorial,
    setTutorialStatus
  };
};
