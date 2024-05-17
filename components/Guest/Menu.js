import React, { createContext, useContext, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  SectionList,
  Text,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { db } from "../../firebaseConfig";
import { collection, doc, getDocs, addDoc, setDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ItemSeparator from "../ItemSeparator";
import { StackActions } from "@react-navigation/native";

function CustomizeMenuItem({ selectedItem, setSelectedItem, addToOrder }) {
  function toggleOption(section, option) {
    setSelectedItem({
      ...selectedItem,
      customize: selectedItem.customize.map((s) =>
        s.id === section.id
          ? {
              ...s,
              selectedOptions: s.selectedOptions?.includes(option)
                ? s.selectedOptions.filter((o) => o !== option)
                : [...(s.selectedOptions || []), option],
            }
          : s
      ),
    });
  }

  function increaseQuantity() {
    setSelectedItem({ ...selectedItem, quantity: selectedItem.quantity + 1 });
  }

  function decreaseQuantity() {
    if (selectedItem.quantity > 1) {
      setSelectedItem({
        ...selectedItem,
        quantity: selectedItem.quantity - 1,
      });
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={selectedItem != null}
      style={selectedStyles.container}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      {selectedItem && (
        <Pressable
          style={selectedStyles.container}
          onPress={() => setSelectedItem(null)}
        >
          <View style={{ flex: 1 }} />
          <SafeAreaView>
            <Pressable style={selectedStyles.viewContainer}>
              <View>
                <Text style={{ textAlign: "center", fontSize: 20 }}>
                  {selectedItem.name}
                </Text>
                <Pressable
                  style={{ position: "absolute", right: 0, top: 0 }}
                  onPress={() => setSelectedItem(null)}
                >
                  <Text style={{ fontSize: 18 }}>X</Text>
                </Pressable>
                <View style={selectedStyles.scrollViewContainer}>
                  <ScrollView>
                    {selectedItem.customize &&
                      selectedItem.customize.map((section) => (
                        <View key={section.id}>
                          <Text style={{ paddingStart: 16 }}>
                            {section.name}
                          </Text>
                          <View
                            style={{ flexDirection: "row", flexWrap: "wrap" }}
                          >
                            {section.options.map((option) => (
                              <View key={option} style={{ width: "50%" }}>
                                <Pressable
                                  onPress={() => toggleOption(section, option)}
                                  style={[
                                    {
                                      borderWidth: 1,
                                      padding: 8,
                                      borderRadius: 8,
                                      margin: 2,
                                    },
                                    section.selectedOptions?.includes(option)
                                      ? selectedStyles.selected
                                      : selectedStyles.unselected,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      {
                                        textAlign: "center",
                                      },
                                      section.selectedOptions?.includes(option)
                                        ? selectedStyles.selected
                                        : selectedStyles.unselected,
                                    ]}
                                  >
                                    {option}
                                  </Text>
                                </Pressable>
                              </View>
                            ))}
                          </View>
                        </View>
                      ))}
                  </ScrollView>
                </View>
                <View style={{ marginVertical: 10 }}>
                  <Text style={{ alignSelf: "center" }}>Quantity</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Pressable
                      style={{
                        paddingHorizontal: 10,
                      }}
                      onPress={decreaseQuantity}
                    >
                      <Text style={{ fontSize: 32 }}>-</Text>
                    </Pressable>
                    <Text style={{ fontSize: 24 }}>
                      {selectedItem.quantity}
                    </Text>
                    <Pressable
                      style={{
                        paddingHorizontal: 10,
                      }}
                      onPress={increaseQuantity}
                    >
                      <Text style={{ fontSize: 32 }}>+</Text>
                    </Pressable>
                  </View>
                </View>
                <ItemSeparator />
                <Button
                  onPress={() => addToOrder(selectedItem)}
                  title="Add to Order"
                />
              </View>
            </Pressable>
          </SafeAreaView>
          <View style={{ flex: 1 }} />
        </Pressable>
      )}
    </Modal>
  );
}

const selectedStyles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flex: 1,
    padding: 8,
    backgroundColor: "rgba(64, 64, 64, .5)",
  },
  viewContainer: {
    borderRadius: 20,
    backgroundColor: "white",
    padding: 16,
  },
  selected: {
    backgroundColor: "black",
    color: "white",
  },
  unselected: {
    backgroundColor: "white",
    color: "black",
  },
});

function MenuItem({ item, editItem, style, quantity, quantityStart }) {
  return (
    <Pressable
      onPress={editItem}
      style={({ pressed }) => [
        {
          backgroundColor: pressed
            ? "#e3e3e3"
            : quantity > 0
            ? "#ebf4ff"
            : "white",
        },
        itemStyles.container,
        style,
      ]}
    >
      <View style={{ flexDirection: quantityStart ? "row-reverse" : "row" }}>
        <View style={itemStyles.textContainer}>
          <Text style={itemStyles.label}>{item.name}</Text>
          {item.customize &&
            item.customize.map((custom) => (
              <View style={itemStyles.customizeHeader} key={custom.name}>
                {custom.options?.length > 0 && (
                  <Text style={itemStyles.customizeText}>
                    {custom.name}: {custom.options?.join(", ")}
                  </Text>
                )}
              </View>
            ))}
        </View>
        {quantity > 0 && (
          <View
            style={{
              alignSelf: "center",
              paddingHorizontal: 8,
              width: 35,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {quantity}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

function MenuCategory({ title }) {
  return (
    <View style={[categoryStyles.headerContainer, itemStyles.container]}>
      <Text style={categoryStyles.label}>{title}</Text>
    </View>
  );
}

function ReviewOrder({ navigation }) {
  const { order, setOrder, name, setName } = useContext(OrderContext);

  function removeFromOrder(index) {
    const newOrder = order.filter((_, i) => i !== index);
    setOrder(newOrder);
    if (newOrder.length === 0) {
      navigation.goBack();
    }
  }

  async function submitOrder() {
    if (!name) return;
    try {
      const docRef = await addDoc(
        collection(db, "events", "Cp4lD5Ko0ZP7WHVkL4BG", "guestorders"),
        { name, order, time: Date.now() }
      );
    } catch (ex) {
      console.log(ex);
    }
    setOrder([]);
    setName("");
    navigation.navigate("Order Submitted");
  }

  return (
    <>
      {order.length > 0 && (
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={(val) => setName(val)}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "lightgray",
              backgroundColor: "white",
              fontSize: 16,
              padding: 8,
              margin: 8,
            }}
          />
          <View style={{ flex: 1 }}>
            <ScrollView>
              {order
                .sort((a, b) => {
                  if (a.sectionId === b.sectionId) {
                    return a.index - b.index;
                  }

                  return a.sectionId - b.sectionId;
                })
                .map((item, index) => (
                  <View
                    key={index}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <MenuItem
                      item={item}
                      quantity={item.quantity}
                      quantityStart={true}
                      style={{ backgroundColor: "transparent", flex: 1 }}
                    />
                    <Pressable
                      onPress={() => removeFromOrder(index)}
                      style={{ padding: 4 }}
                    >
                      <MaterialCommunityIcons
                        name="delete"
                        size={24}
                        color="#ff7878"
                      />
                    </Pressable>
                  </View>
                ))}
            </ScrollView>
          </View>
          {name && (
            <Pressable style={styles.button} onPress={submitOrder}>
              <Text style={styles.buttonText}>Submit Order</Text>
            </Pressable>
          )}
        </View>
      )}
    </>
  );
}

function OrderSubmitted({ navigation }) {
  function newOrder() {
    navigation.dispatch(StackActions.popToTop());
  }

  return (
    <>
      <Text style={{ paddingVertical: 12, fontSize: 24, alignSelf: "center" }}>
        We got your order!
      </Text>
      <Button title="New Order" onPress={newOrder} />
    </>
  );
}

const Stack = createNativeStackNavigator();
function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Build Order" component={Menu} />
      <Stack.Screen name="Review Order" component={ReviewOrder} />
      <Stack.Screen
        name="Order Submitted"
        component={OrderSubmitted}
        options={{ headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
}

const OrderContext = createContext(null);
function OrderScreen({ menu }) {
  const [order, setOrder] = useState([]);
  const [name, setName] = useState();
  return (
    <OrderContext.Provider
      value={{
        menu,
        order,
        setOrder,
        name,
        setName,
      }}
    >
      <StackNavigator />
    </OrderContext.Provider>
  );
}

function Menu({ navigation }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const { menu, order, setOrder } = useContext(OrderContext);

  function addToOrder(item) {
    const selections = item.customize?.flatMap((c) => c.selectedOptions || []);
    item.customize =
      selections?.length > 0 ? [{ name: "with", options: selections }] : null;
    setOrder([...order, item]);
    setSelectedItem(null);
  }

  function reviewOrder() {
    navigation.navigate("Review Order");
  }

  return (
    <>
      <CustomizeMenuItem
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        addToOrder={addToOrder}
      />
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.container}>
          <SectionList
            sections={menu}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, section, index }) => (
              <MenuItem
                item={item}
                quantity={order
                  .filter(
                    (o) => o.sectionId === section.id && o.index === index
                  )
                  .map((o) => o.quantity)
                  .reduce((partialSum, a) => partialSum + a, 0)}
                editItem={() =>
                  setSelectedItem({
                    ...item,
                    sectionId: section.id,
                    index,
                    quantity: item.quantity || 1,
                  })
                }
              />
            )}
            renderSectionHeader={({ section }) => (
              <MenuCategory title={section.title} />
            )}
            ItemSeparatorComponent={ItemSeparator}
          />
        </View>
        {order.length > 0 && (
          <Pressable style={styles.button} onPress={reviewOrder}>
            <Text style={styles.buttonText}>Review Order</Text>
          </Pressable>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
  },
  order: {
    maxHeight: "30%",
    backgroundColor: "lightgray",
    padding: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 50,
    padding: 8,
    width: 200,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
  },
});

const itemStyles = StyleSheet.create({
  customizeHeader: {
    marginStart: 8,
  },
  customizeText: {
    fontSize: 12,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    padding: 8,
    flex: 1,
  },
  label: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 4,
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  headerContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    backgroundColor: "white",
  },
  label: {
    fontSize: 20,
  },
});

export default OrderScreen;
