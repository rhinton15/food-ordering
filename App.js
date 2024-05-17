import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import MainScreen from "./pages/MainScreen";
import "react-native-reanimated";

export default function App() {
  return <MainScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
