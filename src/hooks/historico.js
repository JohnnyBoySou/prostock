import AsyncStorage from "@react-native-async-storage/async-storage";

const saveItem = async(item) => {
  if (!item || !item.id) return; // Verifica se o item e o ID são válidos

  try {
    const history = await AsyncStorage.getItem("history");
    if (history) {
      const historyArray = JSON.parse(history);
      // Verifica se o item já existe no histórico com base no ID
      if (!historyArray.some(existingItem => existingItem.id === item.id)) {
        historyArray.push(item);
        await AsyncStorage.setItem("history", JSON.stringify(historyArray));
      }
    } else {
      await AsyncStorage.setItem("history", JSON.stringify([item]));
    }
  } catch (error) {
    console.log(error);
  }
};

const excludeItem = async(id) => {
  try {
    const history = await AsyncStorage.getItem("history");
    if (history) {
      const historyArray = JSON.parse(history);
      const updatedHistory = historyArray.filter((item) => item.id !== id);
      await AsyncStorage.setItem("history", JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.log(error);
  }
};

const excludeItems = async() => {
  try {
    await AsyncStorage.removeItem("history");
  } catch (error) {
    console.log(error);
  }
};

const listItems = async() => {
  try {
    const history = await AsyncStorage.getItem("history");
    if (history) {
      const historyArray = JSON.parse(history);
      return historyArray;
    }
  } catch (error) {
    console.log(error);
  }
  return [];
};

export { saveItem, excludeItem, listItems, excludeItems };
