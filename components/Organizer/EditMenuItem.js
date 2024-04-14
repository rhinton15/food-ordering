import React from "react";
import {
  Button,
  Modal,
  SafeAreaView,
  Pressable,
  Text,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

function EditMenuItem({ editItem, setEditItem, saveEditItem }) {
  return (
    <Modal
      animationType="slide"
      visible={editItem != null}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      {editItem && (
        <SafeAreaView style={styles.container}>
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Item name"
                style={styles.input}
                value={editItem.name}
                onChangeText={(val) => setEditItem({ ...editItem, name: val })}
              />
            </View>
            {editItem.customize &&
              editItem.customize.map((custom) => (
                <Text key={custom.name}>
                  {custom.name}: {custom.options.join(", ")}
                </Text>
              ))}
          </View>
          <Button onPress={saveEditItem} title="Save" />
        </SafeAreaView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    justifyContent: "space-between",
    flex: 1,
  },

  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#bbb",
  },
  input: {
    padding: 6,
    fontSize: 16,
  },
});

export default EditMenuItem;
