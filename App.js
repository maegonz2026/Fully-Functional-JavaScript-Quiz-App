import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens from the screens folder.
import HomeScreen from "./screens/HomeScreen";
import DecksScreen from "./screens/DecksScreen";
import FlashcardScreen from "./screens/FlashcardScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultsScreen from "./screens/ResultsScreen";

// Imports the provider for shared quiz state.
import { QuizProvider } from "./context/QuizContext";

// Creates the stack navigator used to manage screen navigation.
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // Makes shared quiz state available throughout the application.
    <QuizProvider>
      <NavigationContainer>
        {/* Manages the navigation history of the application. */}
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

            // Uses a slide animation when opening another screen.
            animation: "slide_from_right",

            // Allows users to return to the previous screen.
            headerBackVisible: true,

            // Keeps the header consistent across screens.
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: "#f8fafc",
            },
          }}
        >
          {/* Main landing screen. */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />

          {/* Displays the available study decks. */}
          <Stack.Screen
            name="Decks"
            component={DecksScreen}
            options={{
              title: "Study Decks",
            }}
          />

          {/* Displays flashcards from the selected deck. */}
          <Stack.Screen
            name="Flashcards"
            component={FlashcardScreen}
            options={{
              title: "Flashcards",
            }}
          />

          {/* Displays the JavaScript quiz. */}
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{
              title: "JavaScript Quiz",
            }}
          />

          {/* Displays the final quiz score. */}
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{
              title: "Quiz Results",

              // Hides the header back button on the results screen.
              headerBackVisible: false,

              // Prevents returning to the quiz using the back gesture.
              gestureEnabled: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QuizProvider>
  );
}
