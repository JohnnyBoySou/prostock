import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_TOKEN = "@token";

const get = async() => {
  const token = JSON.parse(await AsyncStorage.getItem(KEY_TOKEN)) || [];
  if (token.length > 0) {
    return token;
  }
};

const save = async(token: string) => {
  try {
    await AsyncStorage.setItem(KEY_TOKEN, JSON.stringify(token));
    return true;
  } catch (error) {
    console.error("Error creating token:", error);
    return false;
  }
};

const exclude = async() => {
  try {
    await AsyncStorage.removeItem(KEY_TOKEN);
    return true;
  } catch (error) {
    console.error("Error excluding token ", error);
    return false;
  }
};

export const TokenService = {
  get,
  save,
  exclude,
}
