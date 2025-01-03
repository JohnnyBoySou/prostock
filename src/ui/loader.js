import { ActivityIndicator } from "react-native";
const Loader = ({ size = 24, color = "#fff" }) => {
  return (
    <ActivityIndicator size={size} color={color} />
  );
};
export default Loader;
