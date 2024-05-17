import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ChefContext } from "./ChefContext";

function OrderItem({ item, orderId }) {
  const { madeToOrder, cooking } = useContext(ChefContext);
  const isMadeToOrder = madeToOrder.some(
    (m) => m.sectionId === item.sectionId && m.index === item.index
  );
  const cookingItem = cooking.find(
    (c) =>
      c.orderId === orderId &&
      c.sectionId == item.sectionId &&
      c.index === item.index
  );

  return (
    <View
      style={{ padding: 1, flexDirection: "row", alignItems: "flex-start" }}
    >
      <View
        style={{
          padding: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
      >
        {!isMadeToOrder ? (
          <MaterialCommunityIcons name="check" color="#bbbbbb" />
        ) : cookingItem ? (
          cookingItem.done ? (
            <MaterialCommunityIcons name="check-bold" color="#30ba55" />
          ) : (
            <MaterialCommunityIcons name="grill" color="#000000" />
          )
        ) : (
          <MaterialCommunityIcons name="exclamation-thick" color="#ff3d3d" />
        )}
        <Text
          style={{ width: 20, fontWeight: isMadeToOrder ? "bold" : "normal" }}
        >
          {item.quantity}
        </Text>
        <Text style={{ fontWeight: isMadeToOrder ? "bold" : "normal" }}>
          {item.name}
        </Text>
      </View>
      {item.customize && (
        <Text
          style={{
            color: "grey",
            flex: 1,
            flexWrap: "wrap",
            paddingStart: 8,
          }}
        >
          {item.customize[0].options?.join(", ")}
        </Text>
      )}
    </View>
  );
}

function Order({ order }) {
  async function toggleComplete() {
    order.done = !order.done;
    await updateDoc(
      doc(db, "events", "Cp4lD5Ko0ZP7WHVkL4BG", "guestorders", order.id),
      {
        done: order.done,
      }
    );
  }
  return (
    <Pressable
      onPress={toggleComplete}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#e3e3e3" : "transparent",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#cccccc",
          padding: 8,
          marginVertical: 4,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", flex: 1 }}>
          {order.name}
        </Text>
        {order.done && (
          <MaterialCommunityIcons name="check-bold" size={24} color="#30ba55" />
        )}
      </View>
      {!order.done &&
        order.order.map((item, i) => {
          return <OrderItem key={i} item={item} orderId={order.id} />;
        })}
    </Pressable>
  );
}

function Orders(props) {
  const { orders } = useContext(ChefContext);

  return (
    <ScrollView style={{ padding: 8 }}>
      {orders
        .sort((a, b) => a.time - b.time)
        .map((order, i) => (
          <Order key={i} order={order} />
        ))}
    </ScrollView>
  );
}

export default Orders;
