import { ActivityIndicator } from "react-native";
const Loader = ({ size = 24, color = "#fff" }: { size: number, color: string }) => {
  return (
    <ActivityIndicator size={size} color={color} />
  );
};
export default Loader;
