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

// Difficulty configuration.
const DIFFICULTIES = {
  Easy: {
    icon: "🌱",
    color: "#16A34A",
    background: "#F0FDF4",
    start: 1,
    end: 20,
    totalQuestions: 70,
  },
  Medium: {
    icon: "⚡",
    color: "#2563EB",
    background: "#EFF6FF",
    start: 21,
    end: 35,
    totalQuestions: 70,
  },
  Hard: {
    icon: "🔥",
    color: "#EA580C",
    background: "#FFF7ED",
    start: 36,
    end: 45,
    totalQuestions: 60,
  },
  Expert: {
    icon: "🏆",
    color: "#9333EA",
    background: "#FAF5FF",
    start: 46,
    end: 50,
    totalQuestions: 50,
  },
};

// Determine how many questions belong to each level.
const getQuestionCount = (level) => {
  if (level <= 10) return 3;
  if (level <= 25) return 4;
  if (level <= 35) return 5;
  if (level <= 45) return 6;
  return 10;
};

// Generate the levels belonging to the selected difficulty.
const generateLevels = (difficulty) => {
  const config = DIFFICULTIES[difficulty];

  if (!config) return [];

  return Array.from(
    { length: config.end - config.start + 1 },
    (_, index) => {
      const levelNumber = config.start + index;

      return {
        number: levelNumber,
        questionCount: getQuestionCount(levelNumber),
      };
    }
  );
};

export default function DifficultyLevelsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  const difficulty = route.params?.difficulty || "Easy";
  const config = DIFFICULTIES[difficulty];
  const levels = generateLevels(difficulty);

  const [completedLevels, setCompletedLevels] = useState([]);

  // Reload saved progress whenever this screen becomes active.
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
          console.error("Error loading level progress:", error);
        }
      };

      loadProgress();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // A level is unlocked if it is the first level,
  // already completed, or its previous level is completed.
  const isLevelUnlocked = (levelNumber) => {
    return (
      levelNumber === 1 ||
      completedLevels.includes(levelNumber) ||
      completedLevels.includes(levelNumber - 1)
    );
  };

  // Open the selected level.
  const handleLevelPress = (level) => {
    if (!isLevelUnlocked(level.number)) return;

    navigation.navigate("Quiz", {
      level: level.number,
      difficulty,
    });
  };

  // Handle invalid difficulty names.
  if (!config) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Difficulty not found.
        </Text>
      </View>
    );
  }

  const completedCount = levels.filter((level) =>
    completedLevels.includes(level.number)
  ).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 20) + 25 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Difficulty introduction */}
      <View style={styles.introContainer}>
        <View
          style={[
            styles.difficultyIconContainer,
            { backgroundColor: config.background },
          ]}
        >
          <Text style={styles.difficultyIcon}>
            {config.icon}
          </Text>
        </View>

        <Text style={styles.title}>
          {difficulty} Levels
        </Text>

        <Text style={styles.subtitle}>
          Complete each level with at least 65% to unlock
          the next challenge.
        </Text>
      </View>

      {/* Difficulty overview */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewLabel}>
          YOUR {difficulty.toUpperCase()} JOURNEY
        </Text>

        <Text style={styles.overviewTitle}>
          Levels {config.start}–{config.end}
        </Text>

        <View style={styles.overviewDivider} />

        <View style={styles.overviewStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {levels.length}
            </Text>
            <Text style={styles.statLabel}>
              Total Levels
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {config.totalQuestions}
            </Text>
            <Text style={styles.statLabel}>
              Question Pool
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>65%</Text>
            <Text style={styles.statLabel}>
              Passing Score
            </Text>
          </View>
        </View>
      </View>

      {/* Level selection heading */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Select a Level
        </Text>

        <Text style={styles.sectionSubtitle}>
          Unlock levels by successfully completing the previous one.
        </Text>
      </View>

      {/* Level grid */}
      <View style={styles.levelGrid}>
        {levels.map((level) => {
          const isUnlocked = isLevelUnlocked(level.number);
          const isCompleted = completedLevels.includes(level.number);

          return (
            <Pressable
              key={level.number}
              disabled={!isUnlocked}
              onPress={() => handleLevelPress(level)}
              style={({ pressed }) => [
                styles.levelCard,
                isUnlocked && styles.unlockedLevelCard,
                isCompleted && styles.completedLevelCard,
                !isUnlocked && styles.lockedLevelCard,
                pressed && styles.pressedLevelCard,
              ]}
            >
              <View
                style={[
                  styles.levelNumberContainer,
                  isUnlocked && {
                    backgroundColor: config.background,
                  },
                  isCompleted && styles.completedNumberContainer,
                ]}
              >
                <Text
                  style={[
                    styles.levelNumber,
                    isUnlocked && { color: config.color },
                    isCompleted && styles.completedNumber,
                  ]}
                >
                  {isCompleted
                    ? "✓"
                    : isUnlocked
                    ? level.number
                    : "🔒"}
                </Text>
              </View>

              <Text
                style={[
                  styles.levelLabel,
                  isUnlocked && styles.activeLevelLabel,
                ]}
              >
                Level {level.number}
              </Text>

              <Text style={styles.questionLabel}>
                {level.questionCount} Qs
              </Text>

              {isCompleted && (
                <Text style={styles.completedLabel}>
                  Completed
                </Text>
              )}

              {isUnlocked && !isCompleted && (
                <Text
                  style={[
                    styles.availableLabel,
                    { color: config.color },
                  ]}
                >
                  Start
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Progress reminder */}
      <View style={styles.reminderCard}>
        <Text style={styles.reminderIcon}>🔒</Text>

        <View style={styles.reminderInfo}>
          <Text style={styles.reminderTitle}>
            Keep Progressing!
          </Text>

          <Text style={styles.reminderDescription}>
            You have completed {completedCount} of {levels.length} levels
            in {difficulty}. Score at least 65% to pass a level and
            unlock the next one.
          </Text>
        </View>
      </View>
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

  introContainer: {
    alignItems: "center",
    marginBottom: 22,
  },

  difficultyIconContainer: {
    width: 66,
    height: 66,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  difficultyIcon: {
    fontSize: 34,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#172554",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 310,
  },

  overviewCard: {
    backgroundColor: "#172554",
    borderRadius: 18,
    padding: 20,
    marginBottom: 27,
  },

  overviewLabel: {
    color: "#BFDBFE",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  overviewTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 7,
  },

  overviewDivider: {
    height: 1,
    backgroundColor: "#334575",
    marginVertical: 18,
  },

  overviewStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  statLabel: {
    color: "#BFDBFE",
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
  },

  sectionHeader: {
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#172554",
    fontSize: 19,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 5,
    lineHeight: 18,
  },

  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginHorizontal: -5,
  },

  levelCard: {
    width: "22%",
    marginHorizontal: "1.5%",
    marginBottom: 12,
    minHeight: 125,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2E8F0",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  unlockedLevelCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#86EFAC",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  completedLevelCard: {
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC",
  },

  lockedLevelCard: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },

  pressedLevelCard: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },

  levelNumberContainer: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  completedNumberContainer: {
    backgroundColor: "#16A34A",
  },

  levelNumber: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "800",
  },

  completedNumber: {
    color: "#FFFFFF",
    fontSize: 23,
  },

  levelLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "700",
  },

  activeLevelLabel: {
    color: "#172554",
  },

  questionLabel: {
    color: "#94A3B8",
    fontSize: 10,
    marginTop: 4,
  },

  availableLabel: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 5,
  },

  completedLabel: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 5,
  },

  reminderCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF",
    borderRadius: 15,
    padding: 16,
    marginTop: 13,
  },

  reminderIcon: {
    fontSize: 23,
    marginRight: 12,
  },

  reminderInfo: {
    flex: 1,
  },

  reminderTitle: {
    color: "#1E40AF",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },

  reminderDescription: {
    color: "#475569",
    fontSize: 12,
    lineHeight: 19,
  },

  errorText: {
    color: "#DC2626",
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    fontWeight: "700",
  },
});
