import React, { useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import Events from "../components/Organizer/Events";
import EditEvent from "../components/Organizer/EditEvent";

const eventsInit = [
  {
    id: 1,
    name: "Mother's Day 2024",
    date: new Date("2024-05-12"),
    menu: [
      {
        id: 1,
        title: "Main Dishes",
        data: [
          {
            name: "Omelet",
            customize: [
              {
                name: "toppings",
                options: ["mushrooms", "peppers", "tomatoes"],
                select: "many",
              },
              {
                name: "cheese",
                options: ["american", "cheddar"],
                select: "one",
              },
            ],
          },
          {
            name: "Pancakes",
            customize: [
              {
                name: "options",
                options: ["chocolate chips"],
                select: "one",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: "Sides",
        data: [
          {
            name: "Fruit",
          },
          { name: "Tots" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Memorial Day 2024",
    date: new Date("2024-05-27"),
    menu: [],
  },
  { id: 3, name: "4th of July 2024", date: new Date("2024-07-04"), menu: [] },
];

function Organizer({ navigation }) {
  const [event, setEvent] = useState();
  const [events, setEvents] = useState(eventsInit);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setEvent({})} title="Add new" />
      ),
    });
  }, [navigation]);

  function saveEvent() {
    console.log(event);
    setEvents(events.map((e) => (e.id === event.id ? event : e)));
    setEvent(null);
  }

  return (
    <View style={styles.container}>
      <Text>
        Organizer should be able to create a new event and add menu items to
        event. Can also copy menu from another event. Menu items can have
        customizations. Can there also be an event agenda? RSVP? People can tell
        what they are bringing
      </Text>
      <Events events={events} setEvent={setEvent} />
      <EditEvent event={event} setEvent={setEvent} saveEvent={saveEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderRadius: 5,
    padding: 8,
  },
});

export default Organizer;
