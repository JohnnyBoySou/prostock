import AsyncStorage from "@react-native-async-storage/async-storage";
const saveWord = async(word) => {
  if (word.length == 0) return;
  try {
    const searchHistory = await AsyncStorage.getItem("searchHistory");
    if (searchHistory) {
      const historyArray = JSON.parse(searchHistory);
      if (!historyArray.includes(word)) {
        historyArray.push(word);
        await AsyncStorage.setItem("searchHistory", JSON.stringify(historyArray));
      }
    } else {
      await AsyncStorage.setItem("searchHistory", JSON.stringify([word]));
    }
  } catch (error) {
    console.log(error);
  }
};

const excludeWord = async(word) => {
  try {
    const searchHistory = await AsyncStorage.getItem("searchHistory");
    if (searchHistory) {
      const historyArray = JSON.parse(searchHistory);
      const updatedHistory = historyArray.filter((item) => item !== word);
      await AsyncStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.log(error);
  }
};

const excludeWords = async() => {
  try {
    await AsyncStorage.removeItem("searchHistory");
  } catch (error) {
    console.log(error);
  }
};

const listWords = async() => {
  try {
    const searchHistory = await AsyncStorage.getItem("searchHistory");
    if (searchHistory) {
      const historyArray = JSON.parse(searchHistory);
      return historyArray;
    }
  } catch (error) {
    console.log(error);
  }
  return [];
};

export { saveWord, excludeWord, listWords, excludeWords };
