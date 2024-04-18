import React, { useState } from "react";
import {
  Alert,
  Button,
  Modal,
  SafeAreaView,
  Pressable,
  Text,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function EditCustomizationOption({ editItem, setEditItem, saveEditItem }) {
  return (
    <Modal
      animationType="slide"
      visible={editItem != null}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      {editItem !== null && (
        <SafeAreaView style={styles.container}>
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Option"
                style={styles.input}
                value={editItem}
                onChangeText={(val) => setEditItem(val)}
              />
            </View>
          </View>
          <Button onPress={saveEditItem} title="Save" />
        </SafeAreaView>
      )}
    </Modal>
  );
}

function EditCustomizationSection({ editItem, setEditItem, saveEditItem }) {
  return (
    <Modal
      animationType="slide"
      visible={editItem != null}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      {editItem !== null && (
        <SafeAreaView style={styles.container}>
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Option"
                style={styles.input}
                value={editItem.name}
                onChangeText={(val) => setEditItem({ ...editItem, name: val })}
              />
            </View>
          </View>
          <Button onPress={saveEditItem} title="Save" />
        </SafeAreaView>
      )}
    </Modal>
  );
}

function AddButton({ addItem, style, title }) {
  return (
    <Pressable
      onPress={addItem}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#e3e3e3" : "white",
        },
        itemStyles.textContainer,
        addItemStyles.button,
        style,
      ]}
    >
      <MaterialCommunityIcons name="plus" size={24} color="#ccc" />
      <Text style={addItemStyles.buttonText}>{title}</Text>
    </Pressable>
  );
}

function CustomizationItem({ item, editItem, deleteItem }) {
  return (
    <Pressable
      onPress={editItem}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#e3e3e3" : "white",
        },
        itemStyles.container,
      ]}
    >
      <Text>{item}</Text>
      <Pressable onPress={deleteItem} style={itemStyles.deleteButton}>
        <MaterialCommunityIcons name="delete" size={24} color="#ff7878" />
      </Pressable>
    </Pressable>
  );
}

function CustomizationSection({
  section,
  editSection,
  deleteSection,
  editSectionOption,
  deleteSectionOption,
}) {
  return (
    <View style={sectionStyles.container}>
      <Pressable
        onPress={editSection}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#e3e3e3" : "white",
          },
          sectionStyles.headerContainer,
          itemStyles.container,
        ]}
      >
        <Text style={sectionStyles.label}>{section.name}</Text>
        <Pressable onPress={deleteSection} style={itemStyles.deleteButton}>
          <MaterialCommunityIcons name="delete" size={24} color="#ff7878" />
        </Pressable>
      </Pressable>
      {section.options &&
        section.options.map((option, index) => (
          <CustomizationItem
            item={option}
            editItem={() => editSectionOption(section, option, index)}
            deleteItem={() => deleteSectionOption(option, section, index)}
            key={option}
          />
        ))}
      <AddButton
        title="option"
        addItem={() => editSectionOption(section, "", null)}
      />
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    // overflow: "hidden",
    // borderRadius: 8, // TODO: is there a better way to do this?
  },
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  label: {
    fontSize: 20,
  },
});

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    padding: 4,
  },
  textContainer: {
    padding: 8,
  },
});

const addItemStyles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    // justifyContent: "center",
    flexDirection: "row",
    marginVertical: 4,
  },
  buttonText: {
    fontSize: 18,
    color: "#ccc",
    // paddingBottom: 1,
  },
  sectionButton: {
    height: 100,
    marginVertical: 16,
  },
});

function EditMenuItem({ editItem, setEditItem, saveEditItem }) {
  const [editOption, setEditOption] = useState(null);
  const [editOptionIndex, setEditOptionIndex] = useState(null);
  const [editOptionSection, setEditOptionSection] = useState(null);
  const [editSection, setEditSection] = useState(null);

  function editSectionOption(section, option, index) {
    setEditOption(option);
    setEditOptionIndex(index);
    setEditOptionSection(section);
  }

  function saveSectionOption() {
    setEditItem({
      ...editItem,
      customize: editItem.customize.map((section) =>
        section.id === editOptionSection.id
          ? {
              ...section,
              options:
                editOptionIndex !== null
                  ? section.options.map((item, index) =>
                      index === editOptionIndex ? editOption : item
                    )
                  : [...(section.options || []), editOption],
            }
          : section
      ),
    });
    setEditOption(null);
  }

  function confirmDeleteSectionOption(option, section, index) {
    Alert.alert("Confirm", `Are you sure you want to delete ${option}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Delete", onPress: () => deleteSectionOption(section, index) },
    ]);
  }

  function deleteSectionOption(deleteSection, deleteIndex) {
    setEditItem({
      ...editItem,
      customize: editItem.customize.map((section) =>
        section.id === deleteSection.id
          ? {
              ...section,
              options: section.options.filter((_, i) => i !== deleteIndex),
            }
          : section
      ),
    });
  }

  function saveSection() {
    setEditItem({
      ...editItem,
      customize: editSection.id
        ? editItem.customize.map((section) =>
            section.id === editSection.id ? editSection : section
          )
        : [
            ...(editItem.customize || []),
            {
              ...editSection,
              id:
                (editItem.customize?.length || 0) > 0
                  ? Math.max(
                      ...editItem.customize.map((section) => section.id)
                    ) + 1
                  : 1,
              // data: [],
            },
          ],
    });
    setEditSection(null);
  }

  function confirmDeleteSection(section) {
    Alert.alert(
      "Confirm",
      `Are you sure you want to delete ${section.name} section? This will also delete all options under this section.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Delete", onPress: () => deleteSection(section) },
      ]
    );
  }

  function deleteSection(deleteSection) {
    setEditItem({
      ...editItem,
      customize: editItem.customize.filter(
        (section) => section.id !== deleteSection.id
      ),
    });
  }

  return (
    <>
      <Modal
        animationType="slide"
        visible={editItem != null}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <EditCustomizationOption
          editItem={editOption}
          setEditItem={setEditOption}
          saveEditItem={saveSectionOption}
        />
        <EditCustomizationSection
          editItem={editSection}
          setEditItem={setEditSection}
          saveEditItem={saveSection}
        />
        {editItem && (
          <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Item name"
                style={styles.input}
                value={editItem.name}
                onChangeText={(val) => setEditItem({ ...editItem, name: val })}
              />
            </View>
            <View style={styles.scrollViewContainer}>
              <ScrollView>
                {editItem.customize &&
                  editItem.customize.map((section) => (
                    <CustomizationSection
                      section={section}
                      key={section.id}
                      editSection={() => setEditSection(section)}
                      deleteSection={() => confirmDeleteSection(section)}
                      editSectionOption={editSectionOption}
                      deleteSectionOption={confirmDeleteSectionOption}
                    />
                  ))}

                <AddButton
                  title="customization"
                  style={addItemStyles.sectionButton}
                  addItem={() => setEditSection({})}
                />
              </ScrollView>
            </View>
            <Button onPress={saveEditItem} title="Save" />
          </SafeAreaView>
        )}
      </Modal>
    </>
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

  scrollViewContainer: {
    flex: 1,
  },
});

export default EditMenuItem;
