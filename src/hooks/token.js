import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async() => {
  const token = JSON.parse(await AsyncStorage.getItem("@token")) || [];
  if (token) {
    return token;
  }
  return null;
};

const createToken = async(token) => {
  try {
    await AsyncStorage.setItem("@token", JSON.stringify(token));
    return true;
  } catch (error) {
    console.error("Error creating token:", error);
    return false;
  }
};
const excludeToken = async() => {
  try {
    await AsyncStorage.removeItem("@token");
    return true;
  } catch (error) {
    console.error("Error excluding token ", error);
    return false;
  }
};

export { getToken, createToken, excludeToken };
