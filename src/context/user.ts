import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface para os dados do usuário
interface User {
  tipo?: string;
  [key: string]: any;
}

// Interface para o contexto do usuário
interface UserContextType {
  user: User | null;
  role?: string;
  saveUser: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  isSignedIn: boolean;
  isLoading: boolean;
}

// Interface para as props do UserProvider
interface UserProviderProps {
  children: ReactNode;
}

// Criação do UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook para consumir o UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};

// Chave para salvar os dados do usuário no AsyncStorage
const USER_DATA_KEY = "user_data";

// Provedor do UserContext
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Carregar dados do usuário do AsyncStorage ao inicializar o contexto
  useEffect(() => {
    const loadUserData = async() => {
      try {
        const userData = await AsyncStorage.getItem(USER_DATA_KEY);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Função para salvar dados do usuário no estado e no AsyncStorage
  const saveUser = async (userData: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Erro ao salvar os dados do usuário:", error);
    }
  };

  // Função para limpar dados do usuário do estado e do AsyncStorage
  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Função para atualizar parcialmente os dados do usuário
  const updateUser = async (updatedData: Partial<User>): Promise<void> => {
    try {
      const newUser = { ...user, ...updatedData };
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error("Erro ao atualizar os dados do usuário:", error);
    }
  };


  const isSignedIn = !!user;
  const role = user?.tipo;

  return React.createElement(
    UserContext.Provider,
    { value: { user, role, saveUser, logout, updateUser, isSignedIn, isLoading } },
    children
  );
};
