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

/*const refreshToken = async () => {
    const token = await getToken();
    if (token) {
        const response = await axios.post(`${BaseURL()}/refresh_token`, { token });
        if (response.status === 200) {
            await createToken(response.data.token);
            return response.data.token;
        }
    }
    return null;
}*/

export { getToken, createToken, excludeToken };
