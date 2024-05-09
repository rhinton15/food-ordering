import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { db } from "../firebaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Menu from "../components/Guest/Menu";

function User(props) {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "events", "Cp4lD5Ko0ZP7WHVkL4BG"),
      (doc) => {
        setMenu(doc.data().menu);
      }
    );
    return unsub;
  }, []);

  return (
    <View style={styles.container}>
      <Menu menu={menu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});

export default User;
