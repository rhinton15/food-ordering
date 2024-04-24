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
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemSeparator from "../ItemSeparator";

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

function MenuItem({ item, editItem, style }) {
  return (
    <Pressable
      onPress={editItem}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#e3e3e3" : "white",
        },
        itemStyles.container,
        style,
      ]}
    >
      <View style={itemStyles.textContainer}>
        <Text style={itemStyles.label}>{item.name}</Text>
        {item.customize &&
          item.customize.map((custom) => (
            <View style={itemStyles.customizeHeader} key={custom.name}>
              <Text style={itemStyles.customizeText}>
                {custom.name}: {custom.options?.join(", ")}
              </Text>
            </View>
          ))}
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
  const { order, setOrder } = useContext(OrderContext);

  function removeFromOrder(index) {
    const newOrder = order.filter((_, i) => i !== index);
    setOrder(newOrder);
    if (newOrder.length === 0) {
      navigation.goBack();
    }
  }

  function submitOrder() {
    setOrder([]);
    navigation.goBack();
  }

  return (
    <>
      {order.length > 0 && (
        <View>
          {/* <Text style={{ fontSize: 20, textAlign: "center" }}>Your Order</Text> */}
          <ScrollView>
            {order.map((item, index) => (
              <MenuItem
                key={index}
                item={item}
                editItem={() => removeFromOrder(index)}
                style={{ backgroundColor: "transparent" }}
              />
            ))}
          </ScrollView>

          <Pressable style={styles.button} onPress={submitOrder}>
            <Text style={styles.buttonText}>Submit Order</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

const Stack = createNativeStackNavigator();
function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Build" component={Menu} />
      <Stack.Screen name="Review" component={ReviewOrder} />
    </Stack.Navigator>
  );
}

const OrderContext = createContext(null);
function OrderScreen({ menu }) {
  const [order, setOrder] = useState([]);
  return (
    <OrderContext.Provider
      value={{
        menu,
        order,
        setOrder,
      }}
    >
      <StackNavigator />
    </OrderContext.Provider>
  );
}

function Menu({ navigation }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const { menu, order, setOrder } = useContext(OrderContext);
  // const [order, setOrder] = useState([]);

  function addToOrder(item) {
    const selections = item.customize?.flatMap((c) => c.selectedOptions);
    item.customize =
      selections?.length > 0 ? [{ name: "with", options: selections }] : null;
    // console.log(item);
    setOrder([...order, item]);
    setSelectedItem(null);
  }

  //   function removeFromOrder(index) {
  //     setOrder(order.filter((_, i) => i !== index));
  //   }

  function reviewOrder() {
    navigation.navigate("Review");
  }

  return (
    <>
      <CustomizeMenuItem
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        addToOrder={addToOrder}
      />
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <SectionList
            sections={menu}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <MenuItem item={item} editItem={() => setSelectedItem(item)} />
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
          //   <Button title="Review Order" onPress={reviewOrder} />
          //   <View style={styles.order}>
          //     <Text style={{ fontSize: 20, textAlign: "center" }}>
          //       Your Order
          //     </Text>
          //     <ScrollView>
          //       {order.map((item, index) => (
          //         <MenuItem
          //           key={index}
          //           item={item}
          //           editItem={() => removeFromOrder(index)}
          //           style={{ backgroundColor: "transparent" }}
          //         />
          //       ))}
          //     </ScrollView>
          //   </View>
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
