
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {

  // Stores the quote selected for the current day.
  const [dailyQuote, setDailyQuote] = useState(null);

  // Tracks whether the API request is still running.
  const [loadingQuote, setLoadingQuote] = useState(true);

  // Stores an error message if the API request fails.
  const [error, setError] = useState("");

  // Calculates the current day number within the year.
  const getDayOfYear = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);

    return Math.floor(
      (today - startOfYear) / (1000 * 60 * 60 * 24)
    );
  };

  // Fetches quotes and selects one based on today's date.
  const fetchDailyQuote = async (isActive = () => true) => {
    try {
      setLoadingQuote(true);
      setError("");

      // Requests the available quotes from DummyJSON.
      const response = await fetch(
        "https://dummyjson.com/quotes?limit=0"
      );

      // Checks whether the API request was successful.
      if (!response.ok) {
        throw new Error("Unable to retrieve quotes.");
      }

      // Converts the API response into JavaScript data.
      const data = await response.json();

      // Checks whether the API returned a valid list.
      if (!data.quotes || data.quotes.length === 0) {
        throw new Error("No quotes were returned.");
      }

      // Uses the current day to select a consistent quote.
      const dayIndex = (getDayOfYear() - 1) % data.quotes.length;

      const selectedQuote = data.quotes[dayIndex];

      // Saves the selected quote and its author.
      if (isActive()) {
        setDailyQuote({
          content: selectedQuote.quote,
          author: selectedQuote.author,
        });
      }

    } catch (err) {
      // Displays an error instead of using backup quotes.
      if (isActive()) {
        setError("Unable to load today's quote. Please try again.");
        setDailyQuote(null);
      }

    } finally {
      // Stops the loading indicator after the request finishes.
      if (isActive()) {
        setLoadingQuote(false);
      }
    }
  };

  // Loads the daily quote when the Home screen first mounts.
  useEffect(() => {
    let isMounted = true;

    fetchDailyQuote(() => isMounted);

    // Prevents state updates after the screen unmounts.
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* HEADER: Displays the app logo and introduction. */}
        <View style={styles.header}>
          <Text style={styles.logo}>JS</Text>

          <Text style={styles.title}>JavaScript</Text>

          <Text style={styles.subtitle}>Mastery Quiz</Text>

          <Text style={styles.description}>
            Learn JavaScript through quizzes, flashcards, and study decks.
          </Text>
        </View>

        {/* MAIN MENU: Navigates to the Quiz, Decks, and History screens. */}
        <View style={styles.menu}>
          <Pressable
            style={({ pressed }) => [
              styles.quizButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate("Quiz")}
          >
            <Text style={styles.quizText}>Start Quiz</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.deckButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate("Decks")}
          >
            <Text style={styles.deckText}>Study Decks</Text>
          </Pressable>

          {/* Opens the saved quiz history. */}
          <Pressable
            style={({ pressed }) => [
              styles.historyButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate("History")}
          >
            <Text style={styles.historyText}>Quiz History</Text>
          </Pressable>
        </View>

        {/* INFORMATION CARD: Explains the quiz content. */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            10 Random JavaScript Questions
          </Text>

          <Text style={styles.infoText}>
            Test your knowledge of JavaScript fundamentals and modern concepts.
          </Text>
        </View>

        {/* DAILY QUOTE: Displays the quote selected for today's date. */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>
            ✨ DAILY STUDY MOTIVATION
          </Text>

          {/* Displays a loading indicator while fetching quotes. */}
          {loadingQuote ? (
            <View style={styles.quoteLoading}>
              <ActivityIndicator size="small" color="#facc15" />

              <Text style={styles.quoteLoadingText}>
                Loading today's inspiration...
              </Text>
            </View>
          ) : error ? (
            // Displays an error and retry button if fetching fails.
            <View style={styles.quoteLoading}>
              <Text style={styles.quoteError}>
                {error}
              </Text>

              <Pressable
                style={styles.retryButton}
                onPress={() => fetchDailyQuote()}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </Pressable>
            </View>
          ) : (
            // Displays the selected quote and its author.
            <>
              <Text style={styles.quoteMark}>“</Text>

              <Text style={styles.quoteText}>
                {dailyQuote?.content}
              </Text>

              <Text style={styles.quoteAuthor}>
                — {dailyQuote?.author}
              </Text>
            </>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// STYLES: Controls the layout, spacing, colors, and typography.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 24,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 5,
  },

  header: {
    alignItems: "center",
    marginTop: 20,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: "#facc15",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 36,
    fontWeight: "900",
    color: "#172554",
    overflow: "hidden",
    marginBottom: 10,
  },

  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#172554",
  },

  subtitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563eb",
    marginTop: 2,
  },

  description: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    maxWidth: 350,
  },

  menu: {
    gap: 14,
    marginTop: 25,
  },

  quizButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  quizText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  deckButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#b6cff0",
  },

  deckText: {
    color: "#1e40af",
    fontSize: 18,
    fontWeight: "700",
  },

  historyButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  historyText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  infoCard: {
    backgroundColor: "#eff6ff",
    padding: 20,
    borderRadius: 18,
    marginTop: 25,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#172554",
  },

  infoText: {
    color: "#64748b",
    marginTop: 5,
    lineHeight: 21,
  },

  quoteCard: {
    backgroundColor: "#172554",
    padding: 20,
    borderRadius: 20,
    marginTop: 25,
    marginBottom: 25,
  },

  quoteLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },

  quoteLoading: {
    alignItems: "center",
    paddingVertical: 30,
  },

  quoteLoadingText: {
    color: "#dbeafe",
    marginTop: 10,
  },

  quoteError: {
    color: "#fecaca",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 15,
  },

  retryButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  retryText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  quoteMark: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 12,
  },

  quoteText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 25,
  },

  quoteAuthor: {
    color: "#bfdbfe",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 15,
  },
});
