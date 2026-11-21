import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

// Correct import: questions.js is inside the data folder.
import questions from "../data/questions";

export default function FlashcardScreen({ route }) {

  // Receives the selected deck from DecksScreen.
  const { deck } = route.params;

  // Filters the question collection to get only this deck's questions.
  const deckQuestions = questions.filter((question) =>
    deck.questionIds.includes(question.id)
  );

  // Stores the shuffled cards for the current deck.
  const [cards, setCards] = useState(() =>
    [...deckQuestions].sort(() => Math.random() - 0.5)
  );

  // Tracks the current flashcard position.
  const [index, setIndex] = useState(0);

  // Tracks whether the current card displays its question or answer.
  const [flipped, setFlipped] = useState(false);

  // COMPONENT LIFECYCLE:
  // Runs when the selected deck changes.
  // Resets the flashcard list and position for the new deck.
  useEffect(() => {
    setCards(
      [...deckQuestions].sort(() => Math.random() - 0.5)
    );

    setIndex(0);
    setFlipped(false);

  }, [deck.id, deckQuestions]);

  // Gets the flashcard at the current index.
  const card = cards[index];

  // Moves to the next card and returns to the first card at the end.
  function nextCard() {
    setFlipped(false);

    setIndex((previous) =>
      previous === cards.length - 1 ? 0 : previous + 1
    );
  }

  // Handles an empty deck safely instead of accessing an undefined card.
  if (!card) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.deckTitle}>
          No flashcards available.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Displays the selected deck name. */}
      <Text style={styles.deckTitle}>
        {deck.title}
      </Text>

      {/* Shows the current card position. */}
      <Text style={styles.counter}>
        Card {index + 1} of {cards.length}
      </Text>

      {/* Tapping the card switches between question and answer. */}
      <Pressable
        style={styles.card}
        onPress={() => setFlipped((previous) => !previous)}
      >
        <Text style={styles.label}>
          {flipped ? "ANSWER" : "QUESTION"}
        </Text>

        <Text style={styles.text}>
          {flipped ? card.answer : card.question}
        </Text>

        {/* Displays the explanation after revealing the answer. */}
        {flipped && (
          <Text style={styles.explanation}>
            {card.explanation}
          </Text>
        )}

        <Text style={styles.tap}>
          Tap card to{" "}
          {flipped ? "see question" : "flip answer"}
        </Text>
      </Pressable>

      {/* Advances to the next flashcard. */}
      <Pressable
        style={styles.button}
        onPress={nextCard}
      >
        <Text style={styles.buttonText}>
          Next Card
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

// STYLES: Controls the flashcard layout and visual appearance.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    justifyContent: "center",
  },

  deckTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "900",
    color: "#172554",
    marginBottom: 5,
  },

  counter: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#172554",
    minHeight: 400,
    borderRadius: 28,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    color: "#93c5fd",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
  },

  text: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 35,
  },

  explanation: {
    color: "#cbd5e1",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 20,
  },

  tap: {
    color: "#94a3b8",
    marginTop: 30,
    fontSize: 13,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 17,
  },
});
