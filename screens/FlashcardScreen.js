
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import questions from "../data/questions";

import {
  getStoredData,
  saveStoredData,
} from "../utils/storage";

import {
  FLASHCARD_PROGRESS_KEY,
} from "./DecksScreen";

export default function FlashcardScreen({ route }) {
  const { deck } = route.params;

  const deckQuestions = useMemo(() => {
    const questionIds = new Set(deck.questionIds);

    return questions.filter((question) =>
      questionIds.has(question.id)
    );
  }, [deck.questionIds]);

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const progressRef = useRef({});

  // LOAD SAVED FLASHCARD PROGRESS
  useEffect(() => {
    let active = true;

    async function loadDeck() {
      setLoading(true);

      try {
        const saved = await getStoredData(
          FLASHCARD_PROGRESS_KEY,
          {}
        );

        const allProgress = saved || {};
        const deckProgress = allProgress[deck.id] || {};

        const savedOrder = Array.isArray(deckProgress.order)
          ? deckProgress.order
          : [];

        const questionMap = new Map(
          deckQuestions.map((question) => [
            question.id,
            question,
          ])
        );

        const restoredCards = savedOrder
          .map((id) => questionMap.get(id))
          .filter(Boolean);

        const restoredIds = new Set(
          restoredCards.map((card) => card.id)
        );

        const remainingCards = deckQuestions.filter(
          (question) => !restoredIds.has(question.id)
        );

        const finalCards = [
          ...restoredCards,
          ...remainingCards,
        ];

        const validIndex = Math.min(
          Math.max(deckProgress.currentIndex || 0, 0),
          Math.max(finalCards.length - 1, 0)
        );

        if (active) {
          progressRef.current = allProgress;

          setProgress(allProgress);
          setCards(finalCards);
          setIndex(validIndex);
          setFlipped(false);
        }
      } catch (error) {
        console.log("Error loading flashcards:", error);

        if (active) {
          setCards(deckQuestions);
          setIndex(0);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDeck();

    return () => {
      active = false;
    };
  }, [deck.id, deckQuestions]);

  // SAVE PROGRESS
  function saveDeckProgress(changes = {}) {
    const currentProgress =
      progressRef.current[deck.id] || {
        mastered: [],
        currentIndex: 0,
        order: deckQuestions.map((question) => question.id),
      };

    const updatedDeck = {
      ...currentProgress,
      ...changes,
    };

    const updatedProgress = {
      ...progressRef.current,
      [deck.id]: updatedDeck,
    };

    progressRef.current = updatedProgress;
    setProgress(updatedProgress);

    saveStoredData(
      FLASHCARD_PROGRESS_KEY,
      updatedProgress
    ).catch((error) => {
      console.log("Error saving flashcard progress:", error);
    });
  }

  const card = cards[index];

  const mastered = progress[deck.id]?.mastered || [];

  const masteredCount = deckQuestions.filter((question) =>
    mastered.includes(question.id)
  ).length;

  const percentage = deckQuestions.length
    ? Math.round(
        (masteredCount / deckQuestions.length) * 100
      )
    : 0;

  // NEXT CARD
  function nextCard() {
    if (cards.length === 0) return;

    const nextIndex =
      index === cards.length - 1 ? 0 : index + 1;

    setIndex(nextIndex);
    setFlipped(false);

    saveDeckProgress({
      currentIndex: nextIndex,
      order: cards.map((item) => item.id),
    });
  }

  // PREVIOUS CARD
  function previousCard() {
    if (cards.length === 0) return;

    const previousIndex =
      index === 0 ? cards.length - 1 : index - 1;

    setIndex(previousIndex);
    setFlipped(false);

    saveDeckProgress({
      currentIndex: previousIndex,
      order: cards.map((item) => item.id),
    });
  }

  // MARK AS MASTERED OR STILL LEARNING
  function updateMastery(isMastered) {
    if (!card) return;

    const currentMastered = [
      ...(progressRef.current[deck.id]?.mastered || []),
    ];

    const updatedMastered = isMastered
      ? currentMastered.includes(card.id)
        ? currentMastered
        : [...currentMastered, card.id]
      : currentMastered.filter((id) => id !== card.id);

    saveDeckProgress({
      mastered: updatedMastered,
      currentIndex: index,
      order: cards.map((item) => item.id),
    });
  }

  // LOADING SCREEN
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loadingText}>
          Loading flashcards...
        </Text>
      </SafeAreaView>
    );
  }

  // EMPTY DECK
  if (!card) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.deckTitle}>
          No flashcards available.
        </Text>
      </SafeAreaView>
    );
  }

  const isMastered = mastered.includes(card.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* DECK HEADER */}
        <Text style={styles.deckTitle}>
          {deck.title} Deck
        </Text>

        <Text style={styles.counter}>
          Card {index + 1} of {cards.length}
        </Text>

        {/* MASTERY PROGRESS */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Mastery Progress
            </Text>

            <Text style={styles.progressPercentage}>
              {percentage}%
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { width: `${percentage}%` },
              ]}
            />
          </View>

          <Text style={styles.progressCount}>
            {masteredCount} of {deckQuestions.length} cards mastered
          </Text>
        </View>

        {/* MASTERY FLASHCARD */}
        <View style={styles.card}>
          {/* CARD CONTENT */}
          <Pressable
            style={styles.cardContent}
            onPress={() => setFlipped((previous) => !previous)}
          >
            <Text style={styles.label}>
              {flipped ? "ANSWER" : "QUESTION"}
            </Text>

            <Text style={styles.cardText}>
              {flipped ? card.answer : card.question}
            </Text>

            {/* ANSWER EXPLANATION */}
            {flipped && card.explanation ? (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationTitle}>
                  Explanation
                </Text>

                <Text style={styles.explanation}>
                  {card.explanation}
                </Text>
              </View>
            ) : null}

            <Text style={styles.tap}>
              Tap here to {flipped ? "hide answer" : "reveal answer"}
            </Text>
          </Pressable>

          {/* MASTERY STATUS */}
          <Text
            style={[
              styles.status,
              isMastered
                ? styles.masteredStatus
                : styles.learningStatus,
            ]}
          >
            {isMastered
              ? "✓ Mastered"
              : "○ Still Learning"}
          </Text>

          {/* MASTERY BUTTONS */}
          <View style={styles.masteryActions}>
            <Pressable
              style={({ pressed }) => [
                styles.learningButton,
                !isMastered && styles.selectedLearning,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => updateMastery(false)}
            >
              <Text
                style={[
                  styles.actionText,
                  !isMastered && styles.selectedLearningText,
                ]}
              >
                ↻ Still Learning
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.masteredButton,
                isMastered && styles.selectedMastered,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => updateMastery(true)}
            >
              <Text
                style={[
                  styles.actionText,
                  isMastered && styles.selectedMasteredText,
                ]}
              >
                ✓ Mastered
              </Text>
            </Pressable>
          </View>
        </View>

        {/* CARD NAVIGATION */}
        <View style={styles.navigation}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.previousPressed,
            ]}
            onPress={previousCard}
          >
            <Text style={styles.secondaryButtonText}>
              ‹ Previous
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.nextPressed,
            ]}
            onPress={nextCard}
          >
            <Text style={styles.nextButtonText}>
              Next ›
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 35,
  },

  loadingText: {
    textAlign: "center",
    marginTop: 15,
    color: "#64748B",
  },

  deckTitle: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "900",
    color: "#172554",
  },

  counter: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 5,
  },

  progressContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  progressLabel: {
    color: "#172554",
    fontWeight: "800",
  },

  progressPercentage: {
    color: "#16A34A",
    fontWeight: "900",
  },

  progressBackground: {
    height: 9,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#16A34A",
    borderRadius: 10,
  },

  progressCount: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 8,
  },

  card: {
    backgroundColor: "#172554",
    minHeight: 390,
    borderRadius: 26,
    padding: 25,
    alignItems: "center",
    marginTop: 22,
  },

  cardContent: {
    width: "100%",
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: "#93C5FD",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
  },

  cardText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 22,
    lineHeight: 34,
  },

  explanationContainer: {
    backgroundColor: "#263B69",
    padding: 15,
    borderRadius: 14,
    marginTop: 22,
    width: "100%",
  },

  explanationTitle: {
    color: "#93C5FD",
    fontWeight: "900",
    marginBottom: 7,
    textAlign: "center",
  },

  explanation: {
    color: "#E2E8F0",
    textAlign: "center",
    lineHeight: 22,
    fontSize: 14,
  },

  status: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 20,
  },

  masteredStatus: {
    color: "#86EFAC",
  },

  learningStatus: {
    color: "#f5ea4f",
  },

  masteryActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    width: "100%",
  },

  // STILL LEARNING - BLUE
  learningButton: {
    flex: 1,
    backgroundColor: "#d4bb61",
    paddingVertical: 14,
    paddingHorizontal: 5,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d4bb61",
  },

  selectedLearning: {
    backgroundColor: "#FEF08A",
    borderColor: "#CA8A04",
    borderWidth: 3,
    shadowColor: "#EAB308",
    shadowOffset: { 
      width: 0, 
      height: 3 
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },

  selectedLearningText: {
    color: "#713F12",
  },

  // MASTERED - GREEN
  masteredButton: {
    flex: 1,
    backgroundColor: "#64b584",
    paddingVertical: 14,
    paddingHorizontal: 5,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#64b584",
  },

  selectedMastered: {
    backgroundColor: "#87ffb1",
    borderColor: "#169745",
    borderWidth: 3,
    shadowColor: "#4ADE80",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },

  selectedMasteredText: {
    color: "#14532D",
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
    textAlign: "center",
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },

  tap: {
    color: "#94A3B8",
    marginTop: 25,
    fontSize: 12,
    textAlign: "center",
  },

  navigation: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  // PREVIOUS BUTTON
  secondaryButton: {
    flex: 1,
    backgroundColor: "#E0EAFA",
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  secondaryButtonText: {
    color: "#1D4ED8",
    fontWeight: "900",
    fontSize: 13,
  },

  previousPressed: {
    backgroundColor: "#BFDBFE",
    borderColor: "#3B82F6",
    transform: [{ scale: 0.96 }],
  },

  // NEXT BUTTON
  nextButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1D4ED8",
    elevation: 3,
  },

  nextButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },

  nextPressed: {
    backgroundColor: "#1E40AF",
    borderColor: "#1E3A8A",
    transform: [{ scale: 0.96 }],
  },
});
