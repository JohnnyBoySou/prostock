import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_DATA = "@store";

const getStore = async() => {
  const res = JSON.parse(await AsyncStorage.getItem(KEY_DATA)) || [];
  if (res) {
    return res;
  }
  return null;
};

const selectStore = async (token) => {
  try {
    await AsyncStorage.setItem(KEY_DATA, JSON.stringify(token));
    return true;
  } catch (error) {
    console.error("Error creating token:", error);
    return false;
  }
};
const excludeStore = async() => {
  try {
    await AsyncStorage.removeItem(KEY_DATA);
    return true;
  } catch (error) {
    console.error("Error excluding token ", error);
    return false;
  }
};

export { getStore, selectStore, excludeStore };
