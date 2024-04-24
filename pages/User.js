import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { db } from "../firebaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Menu from "../components/Guest/Menu";

function User(props) {
  const [menu, setMenu] = useState([]);

  // async function loadMenu() {
  //   const docSnap = await getDoc(doc(db, "events", "Cp4lD5Ko0ZP7WHVkL4BG"));
  //   setMenu(docSnap.data().menu);
  // }

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "events", "Cp4lD5Ko0ZP7WHVkL4BG"),
      (doc) => {
        setMenu(doc.data().menu);
        // setMenu([...doc.data().menu, ...doc.data().menu]);
      }
    );
    return unsub;
    // loadMenu();
  }, []);

  return (
    // <Text>
    //   User should be able to view menu and submit order. Should also be able to
    //   track status of order and get push notification when order is complete.
    // </Text>
    // <Text>In Progress</Text>
    <View style={styles.container}>
      <Menu menu={menu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 8,
    backgroundColor: "white",
    flex: 1,
  },
});

export default User;
