import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";  // Importe a tela inicial
import FullTextScreen from "../screens/FullTextScreen";  // Importe a tela de texto completo

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="FullText" component={FullTextScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
