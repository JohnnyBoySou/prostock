import AsyncStorage from "@react-native-async-storage/async-storage";
const COIN_KEY = "@coins";

// Função para recuperar a quantidade de coins
const getCoins = async() => {
  try {
    const coins = await AsyncStorage.getItem(COIN_KEY);
    return coins ? JSON.parse(coins) : 0; // Retorna 0 se não houver moedas salvas
  } catch (error) {
    console.error("Erro ao recuperar coins:", error);
    return 0;
  }
};

// Função para adicionar coins
const addCoins = async(amount) => {
  try {
    const currentCoins = await getCoins(); // Recupera o saldo atual
    const newCoins = currentCoins + amount; // Adiciona o valor de moedas
    await AsyncStorage.setItem(COIN_KEY, JSON.stringify(newCoins));
    return true;
  } catch (error) {
    console.error("Erro ao adicionar coins:", error);
    return false;
  }
};

// Função para remover coins
const removeCoins = async(amount) => {
  try {
    const currentCoins = await getCoins();
    const newCoins = Math.max(0, currentCoins - amount); // Garante que o saldo não seja negativo
    await AsyncStorage.setItem(COIN_KEY, JSON.stringify(newCoins));
    return true;
  } catch (error) {
    console.error("Erro ao remover coins:", error);
    return false;
  }
};

// Função para resetar o saldo de coins
const resetCoins = async() => {
  try {
    await AsyncStorage.setItem(COIN_KEY, JSON.stringify(0)); // Reseta o saldo para 0
    return true;
  } catch (error) {
    console.error("Erro ao resetar coins:", error);
    return false;
  }
};

export { getCoins, addCoins, removeCoins, resetCoins };
