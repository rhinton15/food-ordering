import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet } from "react-native";
import { db } from "../firebaseConfig";
import { collection, doc, getDocs, addDoc, setDoc } from "firebase/firestore";
import Events from "../components/Organizer/Events";
import EditEvent from "../components/Organizer/EditEvent";

const eventsInit = [
  {
    id: "Cp4lD5Ko0ZP7WHVkL4BG",
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
    id: "DQEqdCJXTKKT7txPFc0s",
    name: "Memorial Day 2024",
    date: new Date("2024-05-27"),
    menu: [],
  },
  {
    id: "HYfxzATbcnfjCuvIN0EJ",
    name: "4th of July 2024",
    date: new Date("2024-07-04"),
    menu: [],
  },
];

function Organizer({ navigation }) {
  const [event, setEvent] = useState();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => setEvent({ name: "", date: new Date(), menu: [] })}
          title="Add new"
        />
      ),
    });
  }, [navigation]);

  async function loadEvents() {
    const querySnapshot = await getDocs(collection(db, "events"));
    const dbEvents = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      dbEvents.push({ ...docData, id: doc.id, date: docData.date?.toDate() });
    });
    // const allEvents = eventsInit.concat(dbEvents);
    // allEvents.sort((a, b) => a.date - b.date);
    // setEvents(allEvents);
    dbEvents.sort((a, b) => a.date - b.date);
    setEvents(dbEvents);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function saveEvent() {
    if (!event.id) {
      // add
      const docRef = await addDoc(collection(db, "events"), event);
      event.id = docRef.id;
      setEvents([...events, event]);
    } else {
      // update
      const { id, ...rest } = event;
      await setDoc(doc(db, "events", id), rest);
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
    }
    setEvent(null);
  }

  return (
    <View style={styles.container}>
      {/* <Text>
        Organizer should be able to create a new event and add menu items to
        event. Can also copy menu from another event. Menu items can have
        customizations. Can there also be an event agenda? RSVP? People can tell
        what they are bringing
      </Text> */}
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
