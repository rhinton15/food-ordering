import React from "react";
import {
  Modal,
  Pressable,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

function Batch({ selectedItem, setSelectedItem, orders, cooking, startBatch }) {
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
              {!orders.groupedOrders &&
                orders.orders
                  .filter((o) => !cooking.some((c) => c.orderId === o.orderId))
                  .map((o) => (
                    <Pressable
                      key={o.orderId}
                      style={{
                        borderWidth: 1,
                        borderRadius: 8,
                        borderColor: "#cccccc",
                        padding: 8,
                      }}
                      onPress={() =>
                        startBatch({
                          selection: o.sel || "plain",
                          orderId: o.orderId,
                          sectionId: o.sectionId,
                          index: o.index,
                          quantity: o.quantity,
                        })
                      }
                    >
                      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        {o.guest}
                      </Text>
                      <Text style={{ fontSize: 14 }}>
                        {o.quantity} {o.sel || "plain"}
                      </Text>
                    </Pressable>
                  ))}
              {/* <View>
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
              </View> */}
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
    gap: 8,
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

export default Batch;
