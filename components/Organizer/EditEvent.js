import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Text,
  TextInput,
  View,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from "react-native";
import DatePicker from "../DatePicker";
import Menu from "./Menu";

function EditEvent({ event, setEvent, saveEvent }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={event != null}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      {event && (
        <View style={styles.container}>
          <View style={styles.container3}>
            <View style={styles.container2}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Event name"
                    style={styles.input}
                    value={event.name}
                    onChangeText={(val) => setEvent({ ...event, name: val })}
                  />
                </View>
                <DatePicker
                  date={event.date}
                  setDate={(val) => setEvent({ ...event, date: val })}
                />
              </View>
              <View style={styles.menuContainer}>
                <Menu
                  menu={event.menu}
                  setMenu={(val) => setEvent({ ...event, menu: val })}
                />
              </View>
              <Button onPress={saveEvent} title="Save" />
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    marginTop: 100,
    padding: 16,
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container3: {
    flex: 1,
    backgroundColor: "rgba(64, 64, 64, .5)",
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#bbb",
    flex: 1,
  },
  input: {
    padding: 6,
    fontSize: 16,
  },
  menuContainer: {
    flex: 1,
  },
});

export default EditEvent;
