import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import MainScreen from "./pages/MainScreen";

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
