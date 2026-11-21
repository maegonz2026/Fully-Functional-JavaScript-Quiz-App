import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens from the screens folder.
import HomeScreen from "./screens/HomeScreen";
import DecksScreen from "./screens/DecksScreen";
import FlashcardScreen from "./screens/FlashcardScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultsScreen from "./screens/ResultsScreen";

// Creates the stack navigator used to move between screens.
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* Main navigation configuration for the application. */}
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#172554",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {/* Main landing screen. */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Displays the available study decks. */}
        <Stack.Screen
          name="Decks"
          component={DecksScreen}
          options={{ title: "Study Decks" }}
        />

        {/* Displays flashcards from the selected deck. */}
        <Stack.Screen
          name="Flashcards"
          component={FlashcardScreen}
          options={{ title: "Flashcards" }}
        />

        {/* Displays the JavaScript quiz. */}
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: "JavaScript Quiz" }}
        />

        {/* Displays the final quiz score. */}
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{
            title: "Quiz Results",
            headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
