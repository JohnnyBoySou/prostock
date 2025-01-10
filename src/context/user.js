import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Criação do UserContext
const UserContext = createContext();

// Hook para consumir o UserContext
export const useUser = () => useContext(UserContext);

// Chave para salvar os dados do usuário no AsyncStorage
const USER_DATA_KEY = "user_data";

// Provedor do UserContext
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const saveUser = async(userData) => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Erro ao salvar os dados do usuário:", error);
    }
  };

  // Função para limpar dados do usuário do estado e do AsyncStorage
  const logout = async() => {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Função para atualizar parcialmente os dados do usuário
  const updateUser = async(updatedData) => {
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

  return (
    <UserContext.Provider value={{ user, role, saveUser, logout, updateUser, isSignedIn, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
