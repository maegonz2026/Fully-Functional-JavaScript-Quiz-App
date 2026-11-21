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
  const fetchDailyQuote = async () => {
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
      setDailyQuote({
        content: selectedQuote.quote,
        author: selectedQuote.author,
      });
    } catch (err) {
      // Displays an error instead of using backup quotes.
      setError("Unable to load today's quote. Please try again.");
      setDailyQuote(null);
    } finally {
      // Stops the loading indicator after the request finishes.
      setLoadingQuote(false);
    }
  };

  // Loads the daily quote when the Home screen first mounts.
  useEffect(() => {
    fetchDailyQuote();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER: Displays the app logo and introduction. */}
        <View style={styles.header}>
          <Text style={styles.logo}>JS</Text>

          <Text style={styles.title}>JavaScript</Text>

          <Text style={styles.subtitle}>Mastery Quiz</Text>

          <Text style={styles.description}>
            Learn JavaScript through quizzes, flashcards, and study decks.
          </Text>
        </View>

        {/* MAIN MENU: Navigates to the Quiz and Decks screens. */}
        <View style={styles.menu}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Quiz")}
          >
            <Text style={styles.primaryText}>Start Quiz</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Decks")}
          >
            <Text style={styles.secondaryText}>Study Decks</Text>
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
              <Text style={styles.quoteError}>{error}</Text>

              <Pressable
                style={styles.retryButton}
                onPress={fetchDailyQuote}
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

  header: {
    alignItems: "center",
    marginTop: 40,
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
    marginBottom: 20,
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
    marginTop: 40,
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  secondaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },

  secondaryText: {
    color: "#1e40af",
    fontSize: 18,
    fontWeight: "700",
  },

  infoCard: {
    backgroundColor: "#eff6ff",
    padding: 20,
    borderRadius: 18,
    marginTop: 30,
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
    backgroundColor: "#2563eb",
    padding: 22,
    borderRadius: 20,
    marginTop: 25,
    marginBottom: 30,
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
    fontSize: 55,
    fontWeight: "900",
    height: 55,
    marginTop: 12,
  },

  quoteText: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "700",
    lineHeight: 29,
    marginTop: 8,
  },

  quoteAuthor: {
    color: "#bfdbfe",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 15,
  },
});
