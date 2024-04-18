import React from "react";
import { Button } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Organizer from "./Organizer";
import User from "./User";
import Chef from "./Chef";

const Tab = createBottomTabNavigator();
const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Events"
      component={Organizer}
      options={({ navigation, route }) => ({
        headerRight: () => <Button title="Add new" />,
        tabBarIcon: ({ size, color }) => (
          <MaterialCommunityIcons name="calendar" size={size} color={color} />
        ),
      })}
    />
    <Tab.Screen
      name="Order"
      component={User}
      options={{
        tabBarIcon: ({ size, color }) => (
          <MaterialCommunityIcons name="food" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Cook"
      component={Chef}
      options={{
        tabBarIcon: ({ size, color }) => (
          <MaterialCommunityIcons name="chef-hat" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

function MainScreen(props) {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default MainScreen;
