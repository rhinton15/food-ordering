import React, { useState } from "react";
import {
  Alert,
  SectionList,
  Text,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ItemSeparator from "../ItemSeparator";
import EditMenuItem from "./EditMenuItem";
import EditMenuSection from "./EditMenuSection";

function MenuItem({ item, editItem, deleteItem }) {
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
      <Pressable onPress={deleteItem} style={itemStyles.deleteButton}>
        <MaterialCommunityIcons name="delete" size={24} color="#ff7878" />
      </Pressable>
    </Pressable>
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

function MenuCategory({ title, editCategory, deleteCategory }) {
  return (
    <Pressable
      onPress={editCategory}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#e3e3e3" : "white",
        },
        categoryStyles.headerContainer,
        itemStyles.container,
      ]}
    >
      <Text style={categoryStyles.label}>{title}</Text>
      <Pressable onPress={deleteCategory} style={itemStyles.deleteButton}>
        <MaterialCommunityIcons name="delete" size={24} color="#ff7878" />
      </Pressable>
    </Pressable>
  );
}

// function MenuCategory({ category }) {
//   return (
//     <View style={categoryStyles.container}>
//       <View style={categoryStyles.headerContainer}>
//         <Text style={categoryStyles.label}>{category.category}</Text>
//       </View>
//       {category.items.map((item) => (
//         <MenuItem item={item} key={item.name} />
//       ))}
//     </View>
//   );
// }

function Menu({ menu, setMenu }) {
  const [editItem, setEditItem] = useState(null);
  const [editItemSection, setEditItemSection] = useState(null);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [editSection, setEditSection] = useState(null);

  function addMenuItem(section) {
    editMenuItem({}, section, null);
  }

  function editMenuItem(item, section, index) {
    setEditItem(item);
    setEditItemSection(section);
    setEditItemIndex(index);
  }

  function saveEditItem() {
    setMenu(
      menu.map((section) =>
        section.id === editItemSection.id
          ? {
              ...section,
              data:
                editItemIndex !== null
                  ? section.data.map((item, index) =>
                      index === editItemIndex ? editItem : item
                    )
                  : [...section.data, editItem],
            }
          : section
      )
    );
    setEditItem(null);
  }

  function confirmDeleteItem(item, section, index) {
    Alert.alert("Confirm", `Are you sure you want to delete ${item.name}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Delete", onPress: () => deleteItem(section, index) },
    ]);
  }

  function deleteItem(deleteSection, deleteIndex) {
    setMenu(
      menu.map((section) =>
        section.id === deleteSection.id
          ? {
              ...section,
              data: section.data.filter((_, i) => i !== deleteIndex),
            }
          : section
      )
    );
  }

  function addSection() {
    setEditSection({});
  }

  function saveEditSection() {
    setMenu(
      editSection.id
        ? menu.map((section) =>
            section.id === editSection.id ? editSection : section
          )
        : [
            ...menu,
            {
              ...editSection,
              id:
                menu.length > 0
                  ? Math.max(...menu.map((section) => section.id)) + 1
                  : 1,
              data: [],
            },
          ]
    );
    setEditSection(null);
  }

  function confirmDeleteSection(section) {
    Alert.alert(
      "Confirm",
      `Are you sure you want to delete ${section.title} section? This will also delete all menu items under this section.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Delete", onPress: () => deleteMenuSection(section) },
      ]
    );
  }

  function deleteMenuSection(deleteSection) {
    setMenu(menu.filter((section) => section.id !== deleteSection.id));
  }

  return (
    <>
      <EditMenuItem
        editItem={editItem}
        setEditItem={setEditItem}
        saveEditItem={saveEditItem}
      />
      <EditMenuSection
        editSection={editSection}
        setEditSection={setEditSection}
        saveEditSection={saveEditSection}
      />
      <SectionList
        sections={menu}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, section, index }) => (
          <MenuItem
            item={item}
            editItem={() => editMenuItem(item, section, index)}
            deleteItem={() => confirmDeleteItem(item, section, index)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <MenuCategory
            title={section.title}
            editCategory={() => setEditSection(section)}
            deleteCategory={() => confirmDeleteSection(section)}
          />
        )}
        // SectionSeparatorComponent={ItemSeparator}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionFooter={({ section }) => (
          <AddButton title="item" addItem={() => addMenuItem(section)} />
        )}
        ListFooterComponent={() => (
          <AddButton
            title="section"
            style={addItemStyles.sectionButton}
            addItem={addSection}
          />
        )}
      />
      {/* <Text>TODO: make this reorderable</Text> */}
    </>
  );
}

// function Menu({ menu }) {
//   return menu.map((category) => (
//     <MenuCategory category={category} key={category.category} />
//   ));
// }

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

const categoryStyles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  headerContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    // backgroundColor: "#fff",
  },
  label: {
    fontSize: 20,
  },
});

export default Menu;
