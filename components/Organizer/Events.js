import React from "react";
import { FlatList, Pressable, Text, View, StyleSheet } from "react-native";
import ItemSeparator from "../ItemSeparator";

function EventDate({ date }) {
  return (
    <View style={eventDateStyles.container}>
      <Text style={eventDateStyles.month}>
        {date.toLocaleString("default", { month: "short" })}
      </Text>
      <Text style={eventDateStyles.day}>{date.getDate()}</Text>
    </View>
  );
}

const eventDateStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 35,
  },
  month: { fontSize: 12 },
  day: {
    fontSize: 28,
    lineHeight: 30,
  },
});

function Event({ event, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#e3e3e3" : "transparent",
        },
        eventStyles.container,
      ]}
    >
      <EventDate date={event.date} />
      <Text>{event.name}</Text>
    </Pressable>
  );
}

function Events({ events, setEvent }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(event) => event.name}
        renderItem={({ item }) => (
          <Event event={item} onPress={() => setEvent(item)} />
        )}
        ItemSeparatorComponent={<ItemSeparator />}
      />
    </View>
  );
}

const eventStyles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});

const styles = StyleSheet.create({
  container: {},
});

export default Events;
