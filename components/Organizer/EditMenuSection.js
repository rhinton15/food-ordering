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

function EditMenuSection({ editSection, setEditSection, saveEditSection }) {
  return (
    <Modal
      animationType="slide"
      visible={editSection != null}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      {editSection && (
        <SafeAreaView style={styles.container}>
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Section name"
                style={styles.input}
                value={editSection.title}
                onChangeText={(val) =>
                  setEditSection({ ...editSection, title: val })
                }
              />
            </View>
          </View>
          <Button onPress={saveEditSection} title="Save" />
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

export default EditMenuSection;
