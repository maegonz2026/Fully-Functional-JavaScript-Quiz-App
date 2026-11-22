import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LEVEL_PROGRESS_KEY = "@javascript_mastery:level_progress";

// Difficulty information and level ranges.
const DIFFICULTIES = [
  {
    name: "Easy",
    description: "Learn the JavaScript fundamentals.",
    icon: "🌱",
    color: "#16A34A",
    background: "#F0FDF4",
    levelStart: 1,
    levelEnd: 20,
    levelRange: "Levels 1–20",
    questionCount: "70 Questions",
  },
  {
    name: "Medium",
    description: "Practice your growing JavaScript knowledge.",
    icon: "⚡",
    color: "#2563EB",
    background: "#EFF6FF",
    levelStart: 21,
    levelEnd: 35,
    levelRange: "Levels 21–35",
    questionCount: "70 Questions",
  },
  {
    name: "Hard",
    description: "Challenge yourself with advanced concepts.",
    icon: "🔥",
    color: "#EA5808",
    background: "#FFF7ED",
    levelStart: 36,
    levelEnd: 45,
    levelRange: "Levels 36–45",
    questionCount: "60 Questions",
  },
  {
    name: "Expert",
    description: "Test your mastery of JavaScript.",
    icon: "🏆",
    color: "#9333EA",
    background: "#FAF5FF",
    levelStart: 46,
    levelEnd: 50,
    levelRange: "Levels 46–50",
    questionCount: "50 Questions",
  },
];

// Check whether every level in a range has been completed.
const hasCompletedRange = (completedLevels, start, end) => {
  for (let level = start; level <= end; level++) {
    if (!completedLevels.includes(level)) {
      return false;
    }
  }

  return true;
};

export default function DifficultyScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [completedLevels, setCompletedLevels] = useState([]);

  // Reload progress whenever the difficulty screen is focused.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProgress = async () => {
        try {
          const savedProgress = await AsyncStorage.getItem(
            LEVEL_PROGRESS_KEY
          );

          if (!isActive) return;

          if (savedProgress) {
            const parsedProgress = JSON.parse(savedProgress);

            const savedLevels = Array.isArray(
              parsedProgress.completedLevels
            )
              ? parsedProgress.completedLevels
              : [];

            setCompletedLevels(
              savedLevels
                .map(Number)
                .filter(
                  (level) =>
                    Number.isInteger(level) &&
                    level >= 1 &&
                    level <= 50
                )
            );
          } else {
            setCompletedLevels([]);
          }
        } catch (error) {
          console.error("Error loading difficulty progress:", error);
        }
      };

      loadProgress();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Determine whether each difficulty is unlocked.
  const getDifficultyStatus = (difficulty) => {
    const previousDifficulty = DIFFICULTIES.find(
      (item) => item.levelEnd === difficulty.levelStart - 1
    );

    const isUnlocked =
      difficulty.name === "Easy" ||
      (previousDifficulty &&
        hasCompletedRange(
          completedLevels,
          previousDifficulty.levelStart,
          previousDifficulty.levelEnd
        ));

    const isCompleted = hasCompletedRange(
      completedLevels,
      difficulty.levelStart,
      difficulty.levelEnd
    );

    return {
      isUnlocked,
      isCompleted,
    };
  };

  // Open the selected difficulty if it is unlocked.
  const openDifficulty = (difficulty) => {
    const { isUnlocked } = getDifficultyStatus(difficulty);

    if (!isUnlocked) return;

    navigation.navigate("DifficultyLevels", {
      difficulty: difficulty.name,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 20) + 25 },
      ]}
      showsVerticalScrollIndicator={false}
    >

      {/* Overall learning journey */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewTop}>
          <View style={styles.overviewTextContainer}>
            <Text style={styles.overviewLabel}>
              YOUR LEARNING JOURNEY
            </Text>

            <Text style={styles.overviewTitle}>
              50 Levels to Master
            </Text>
          </View>

          <Text style={styles.overviewIcon}>🎯</Text>
        </View>

        <View style={styles.overviewDivider} />

        <View style={styles.overviewStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50</Text>
            <Text style={styles.statLabel}>Total Levels</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>250</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Difficulties</Text>
          </View>
        </View>
      </View>

      {/* Difficulty selection */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Difficulty Levels</Text>

        <Text style={styles.sectionSubtitle}>
          Complete each difficulty to unlock the next one.
        </Text>
      </View>

      {DIFFICULTIES.map((difficulty) => {
        const { isUnlocked, isCompleted } =
          getDifficultyStatus(difficulty);

        return (
          <Pressable
            key={difficulty.name}
            onPress={() => openDifficulty(difficulty)}
            disabled={!isUnlocked}
            style={({ pressed }) => [
              styles.difficultyCard,
              !isUnlocked && styles.lockedCard,
              pressed && isUnlocked && styles.pressedCard,
            ]}
          >
            {/* Difficulty icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: difficulty.background },
                !isUnlocked && styles.lockedIconContainer,
              ]}
            >
              <Text style={styles.difficultyIcon}>
                {difficulty.icon}
              </Text>
            </View>

            {/* Difficulty information */}
            <View style={styles.difficultyInfo}>
              <View style={styles.difficultyTitleRow}>
                <Text style={styles.difficultyName}>
                  {difficulty.name}
                </Text>

                {!isUnlocked && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockBadgeText}>
                      🔒 Locked
                    </Text>
                  </View>
                )}

                {isUnlocked && isCompleted && (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedBadgeText}>
                      ✓ Completed
                    </Text>
                  </View>
                )}

                {isUnlocked && !isCompleted && (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedBadgeText}>
                      Unlocked
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.difficultyDescription}>
                {difficulty.description}
              </Text>

              <View style={styles.detailsRow}>
                <Text
                  style={[
                    styles.levelRange,
                    { color: difficulty.color },
                  ]}
                >
                  {difficulty.levelRange}
                </Text>

                <Text style={styles.questionCount}>
                  {difficulty.questionCount}
                </Text>
              </View>
            </View>

            {/* Navigation indicator */}
            <Text style={styles.arrow}>
              {isUnlocked ? "›" : "🔒"}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
  },

  overviewCard: {
    backgroundColor: "#2563EB",
    borderRadius: 18,
    padding: 20,
    marginBottom: 30,
    marginTop: 20,
  },

  overviewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  overviewTextContainer: {
    flex: 1,
  },

  overviewLabel: {
    color: "#BFDBFE",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 7,
  },

  overviewTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  overviewIcon: {
    fontSize: 35,
  },

  overviewDivider: {
    height: 1,
    backgroundColor: "#122354",
    marginVertical: 18,
  },

  overviewStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },

  statLabel: {
    color: "#BFDBFE",
    fontSize: 11,
    marginTop: 4,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#172554",
  },

  sectionSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 19,
  },

  difficultyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },

  lockedCard: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
    opacity: 0.8,
  },

  pressedCard: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  lockedIconContainer: {
    opacity: 0.65,
  },

  difficultyIcon: {
    fontSize: 27,
  },

  difficultyInfo: {
    flex: 1,
  },

  difficultyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 7,
  },

  difficultyName: {
    color: "#172554",
    fontSize: 16,
    fontWeight: "800",
  },

  lockBadge: {
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  lockBadgeText: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "700",
  },

  unlockedBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  unlockedBadgeText: {
    color: "#166534",
    fontSize: 10,
    fontWeight: "700",
  },

  difficultyDescription: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 9,
    gap: 5,
  },

  levelRange: {
    fontSize: 11,
    fontWeight: "700",
  },

  questionCount: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
  },

  arrow: {
    fontSize: 27,
    color: "#94A3B8",
    marginLeft: 8,
    fontWeight: "600",
  },
});
