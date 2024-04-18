import React, { useState } from "react";
import { Pressable, SectionList, Text, View, StyleSheet } from "react-native";
import ItemSeparator from "../ItemSeparator";

function MenuItem({ item, editItem }) {
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

function Menu({ menu }) {
  const [order, setOrder] = useState([]);
  function addToOrder(item) {
    setOrder([...order, item]);
  }
  return (
    <View style={styles.container}>
      <SectionList
        sections={menu}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <MenuItem item={item} editItem={() => addToOrder(item)} />
        )}
        renderSectionHeader={({ section }) => (
          <MenuCategory title={section.title} />
        )}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: "100%",
    // overflow: "scroll",
    flex: 1,
    flexDirection: "row",
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

export default Menu;
