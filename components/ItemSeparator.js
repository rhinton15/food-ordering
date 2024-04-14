import React from "react";
import { View, StyleSheet } from "react-native";

function ItemSeparator(props) {
  return <View style={styles.divider}></View>;
}

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
  },
});

export default ItemSeparator;
