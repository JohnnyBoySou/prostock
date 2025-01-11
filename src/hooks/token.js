import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async() => {
  const token = JSON.parse(await AsyncStorage.getItem("@token")) || [];
  if (token.length > 0) {
    return token;
  }
  return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3N0b2NrLmVuZ2VuaGFyaWFkaWdpdGFsLm5ldC9hcGkvYXV0aCIsImlhdCI6MTczNjM2ODUxOCwiZXhwIjoxNzQxNjI0NTE4LCJuYmYiOjE3MzYzNjg1MTgsImp0aSI6InRoS0NUY3JiR3JDdmtxcWoiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.z5xBXbG3qGckHTAhuhdtf7AMVDm3n34vdaYGcCbwVKs';
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
