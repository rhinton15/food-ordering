import { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
import { db } from "../../firebaseConfig";
import { doc, onSnapshot, collection } from "firebase/firestore";
import Orders from "./Orders";
import Cooking from "./Cooking";
import { ChefContext } from "./ChefContext";

const Tab = createMaterialTopTabNavigator();

function Chef() {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [madeToOrder, setMadeToOrder] = useState([]);
  const [cooking, setCooking] = useState([]);
  const [cooked, setCooked] = useState([]);
  //   const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "events", "Cp4lD5Ko0ZP7WHVkL4BG", "orders"),
      (snapshot) => {
        let newOrders = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            newOrders.push({ ...change.doc.data(), id: change.doc.id });
          }
        });
        setOrders((prev) => [...prev, ...newOrders]);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "events", "Cp4lD5Ko0ZP7WHVkL4BG"),
      (doc) => {
        setMenu(doc.data().menu);
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    setMadeToOrder(
      menu.flatMap((section) =>
        section.data
          .map((item, index) => {
            return {
              ...item,
              customize: item.customize?.filter((c) => c.madeToOrder),
              index,
              sectionId: section.id,
            };
          })
          .filter((item) => item.customize?.length > 0)
      )
    );
  }, [menu]);
  return (
    // <SafeAreaProvider>
    <ChefContext.Provider
      value={{
        menu,
        madeToOrder,
        orders,
        cooking,
        setCooking,
        cooked,
        setCooked,
      }}
    >
      <Tab.Navigator
        style={
          {
            // Paddings to handle safe area
            //   paddingTop: insets.top,
            //   paddingBottom: insets.bottom,
            //   paddingLeft: insets.left,
            //   paddingRight: insets.right,
          }
        }
      >
        <Tab.Screen name="What's Cookin'" component={Cooking} />
        <Tab.Screen name="Orders" component={Orders} />
      </Tab.Navigator>
    </ChefContext.Provider>
    // </SafeAreaProvider>
  );
}

export default Chef;
