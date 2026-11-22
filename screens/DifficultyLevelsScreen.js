import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// Difficulty configuration.
// The question counts follow the agreed 50-level structure.
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
  if (level <= 20) return 4;
  if (level <= 25) return 4;
  if (level <= 35) return 5;
  if (level <= 45) return 6;
  return 10;
};

// Generate only the levels belonging to the selected difficulty.
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

  // Read the selected difficulty sent by DifficultyScreen.
  const difficulty = route.params?.difficulty || "Easy";

  const config = DIFFICULTIES[difficulty];

  // Generate the selected difficulty's level list.
  const levels = generateLevels(difficulty);

  // Temporary unlock logic for the UI.
  // Actual progression and saved unlocks will be implemented
  // in the next commit.
  const unlockedLevel = 1;

  // Open the quiz with the selected level.
  const handleLevelPress = (level) => {
    if (level.number !== unlockedLevel) {
      return;
    }

    navigation.navigate("Quiz", {
      level: level.number,
      difficulty,
    });
  };

  // Avoid rendering an invalid difficulty.
  if (!config) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Difficulty not found.
        </Text>
      </View>
    );
  }

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
          Complete each level with at least 75% to unlock
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
            <Text style={styles.statNumber}>75%</Text>
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

      {/* Display levels for the selected difficulty only */}
      <View style={styles.levelGrid}>
        {levels.map((level) => {
          const isUnlocked = level.number === unlockedLevel;
          const isCompleted = false;

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
              {/* Level number or status icon */}
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

      {/* Unlock reminder */}
      <View style={styles.reminderCard}>
        <Text style={styles.reminderIcon}>🔒</Text>

        <View style={styles.reminderInfo}>
          <Text style={styles.reminderTitle}>
            Keep Progressing!
          </Text>

          <Text style={styles.reminderDescription}>
            Score at least 75% to pass a level. Passing
            unlocks the next level in this difficulty.
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

  // Four-column responsive level grid.
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
