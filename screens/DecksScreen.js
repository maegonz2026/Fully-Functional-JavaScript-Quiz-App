
import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { getStoredData } from "../utils/storage";

export const FLASHCARD_PROGRESS_KEY =
  "@javascript_mastery:flashcard_progress";

const createQuestionIds = (start, end) =>
  Array.from(
    { length: end - start + 1 },
    (_, index) => String(start + index)
  );

const decks = [
  {
    id: "easy",
    title: "Easy",
    description: "Learn JavaScript fundamentals.",
    icon: "🌱",
    color: "#16a34a",
    questionIds: createQuestionIds(1, 70),
  },
  {
    id: "medium",
    title: "Medium",
    description: "Practice intermediate JavaScript concepts.",
    icon: "📘",
    color: "#2563eb",
    questionIds: createQuestionIds(71, 140),
  },
  {
    id: "hard",
    title: "Hard",
    description: "Challenge your JavaScript knowledge.",
    icon: "🔥",
    color: "#ea580c",
    questionIds: createQuestionIds(141, 200),
  },
  {
    id: "expert",
    title: "Expert",
    description: "Master advanced JavaScript concepts.",
    icon: "🏆",
    color: "#9333ea",
    questionIds: createQuestionIds(201, 250),
  },
];

export default function DecksScreen({ navigation }) {
  const [progress, setProgress] = useState({});

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadProgress() {
        const saved = await getStoredData(
          FLASHCARD_PROGRESS_KEY,
          {}
        );

        if (active) {
          setProgress(saved || {});
        }
      }

      loadProgress();

      return () => {
        active = false;
      };
    }, [])
  );

  function openDeck(deck) {
    navigation.navigate("Flashcards", { deck });
  }

  function renderDeck({ item }) {
    const saved = progress[item.id] || {};

    const mastered = Array.isArray(saved.mastered)
      ? saved.mastered
      : [];

    const total = item.questionIds.length;

    const masteredCount = item.questionIds.filter((id) =>
      mastered.includes(id)
    ).length;

    const percentage = Math.round(
      (masteredCount / total) * 100
    );

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={() => openDeck(item)}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: item.color + "18" },
            ]}
          >
            <Text style={styles.icon}>{item.icon}</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>
              {item.description}
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.count}>{total} cards</Text>
          <Text style={styles.mastered}>
            {masteredCount}/{total} mastered
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: item.color,
              },
            ]}
          />
        </View>

        <Text style={styles.percentage}>
          {percentage}% completed
        </Text>
      </Pressable>
    );
  }

  function renderHeader() {
    return (
      <View style={styles.top}>
        <Text style={styles.title}>Study Decks</Text>
        <Text style={styles.subtitle}>
          Choose a difficulty and improve your JavaScript knowledge.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        renderItem={renderDeck}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 65,
    gap: 15,
  },

  top: {
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 25,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
  },

  arrow: {
    fontSize: 28,
    color: "#94A3B8",
    marginLeft: 8,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  count: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },

  mastered: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },

  progressBackground: {
    height: 7,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  percentage: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "right",
    marginTop: 8,
  },
});
