import React, { useEffect, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

// Imports the AsyncStorage utility functions.
import {
  getStoredData,
  saveStoredData,
  STORAGE_KEYS,
} from "../utils/storage";

export default function ResultsScreen({ navigation, route }) {

  // Receives the final score and total questions from QuizScreen.
  const score = route.params?.score ?? 0;
  const total = route.params?.total ?? 10;

  // Calculates the percentage while preventing division by zero.
  const percentage =
    total > 0 ? Math.round((score / total) * 100) : 0;

  // Keeps the same result record if the effect runs again.
  const resultRef = useRef(null);

  // Saves the completed quiz result to the device.
  useEffect(() => {

    // Creates the result record only once.
    if (resultRef.current === null) {
      resultRef.current = {
        id: Date.now().toString(),
        score,
        total,
        percentage,
        completedAt: new Date().toISOString(),
      };
    }

    // Saves the result without displaying a storage message.
    async function saveQuizResult() {
      try {
        // Retrieves previously saved quiz results.
        const previousResults = await getStoredData(
          STORAGE_KEYS.QUIZ_HISTORY,
          []
        );

        // Ensures the retrieved history is an array.
        const quizHistory = Array.isArray(previousResults)
          ? previousResults
          : [];

        // Prevents the same result from being saved twice.
        const alreadySaved = quizHistory.some(
          (result) => result.id === resultRef.current.id
        );

        if (!alreadySaved) {
          // Adds the new result while preserving previous records.
          const updatedHistory = [
            ...quizHistory,
            resultRef.current,
          ];

          await saveStoredData(
            STORAGE_KEYS.QUIZ_HISTORY,
            updatedHistory
          );
        }

      } catch (error) {
        // Keeps storage errors from interrupting the Results screen.
      }
    }

    saveQuizResult();

  }, [score, total, percentage]);

  // Starts a new quiz by replacing the current Results screen.
  function tryAgain() {
    navigation.replace("Quiz");
  }

  // Clears the previous navigation history and returns to Home.
  function goHome() {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* RESULT CONTENT: Displays completion status and final score. */}
      <View style={styles.content}>
        <Text style={styles.icon}>✓</Text>

        <Text style={styles.title}>Quiz Complete!</Text>

        <Text style={styles.subtitle}>
          Here is your final score
        </Text>

        {/* SCORE CARD: Displays the score and percentage. */}
        <View style={styles.scoreCard}>
          <Text style={styles.score}>
            {score}/{total}
          </Text>

          <Text style={styles.percentage}>
            {percentage}%
          </Text>
        </View>

        {/* FEEDBACK MESSAGE: Changes according to the percentage. */}
        <Text style={styles.message}>
          {percentage >= 80
            ? "Excellent JavaScript knowledge!"
            : percentage >= 60
            ? "Good job! Keep studying."
            : "Keep practicing and try again!"}
        </Text>
      </View>

      {/* NAVIGATION: Allows the user to retry or return Home. */}
      <View style={styles.buttons}>
        <Pressable
          style={styles.primaryButton}
          onPress={tryAgain}
        >
          <Text style={styles.primaryText}>
            Try Again
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={goHome}
        >
          <Text style={styles.secondaryText}>
            Back to Home
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// STYLES: Controls the results screen layout and appearance.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 24,
    justifyContent: "space-between",
  },

  content: {
    alignItems: "center",
    marginTop: 60,
  },

  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    fontSize: 45,
    fontWeight: "900",
    textAlign: "center",
    textAlignVertical: "center",
    paddingTop: 12,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#172554",
    marginTop: 25,
  },

  subtitle: {
    color: "#64748b",
    fontSize: 16,
    marginTop: 8,
  },

  scoreCard: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    padding: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  score: {
    fontSize: 52,
    fontWeight: "900",
    color: "#2563eb",
  },

  percentage: {
    fontSize: 20,
    fontWeight: "700",
    color: "#64748b",
  },

  message: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginTop: 25,
  },

  buttons: {
    gap: 12,
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },

  primaryText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
  },

  secondaryButton: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  secondaryText: {
    color: "#1e40af",
    fontSize: 17,
    fontWeight: "800",
  },
});
