import AsyncStorage from "@react-native-async-storage/async-storage";
const key = "@flow";

// Função para salvar uma nova página na coleção
export const addFlow = async(pageInfo) => {
  try {
    // Obtém as páginas salvas existentes (se houver) e as inicializa como array
    const savedPages = JSON.parse(await AsyncStorage.getItem(key)) || [];

    // Adiciona a nova página ao array
    savedPages.push(pageInfo);

    // Salva o array atualizado no AsyncStorage
    await AsyncStorage.setItem(key, JSON.stringify(savedPages));
    return true;
  } catch (error) {
    console.error("Erro ao salvar página:", error);
    return false;
  }
};

// Função para listar todas as páginas salvas
export const listFlow = async() => {
  try {
    const savedPages = await AsyncStorage.getItem(key);
    return savedPages ? JSON.parse(savedPages) : [];
  } catch (error) {
    console.error("Erro ao listar páginas salvas:", error);
    return [];
  }
};

// Função para remover uma página da coleção por ID
export const removeFlow = async(id) => {
  try {
    const savedPages = JSON.parse(await AsyncStorage.getItem(key)) || [];
    const filteredPages = savedPages.filter((item) => item.id !== id);
    if (filteredPages.length !== savedPages.length) {
      await AsyncStorage.setItem(key, JSON.stringify(filteredPages));
      console.log(`Item com id ${id} removido com sucesso.`);
      return true;
    } else {
      console.warn(`Item com id ${id} não encontrado.`);
      return false;
    }
  } catch (error) {
    console.error("Erro ao remover página:", error);
    return false;
  }
};
