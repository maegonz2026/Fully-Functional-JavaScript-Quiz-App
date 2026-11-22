import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

// Difficulty information and the levels assigned to each category.
const DIFFICULTIES = [
  {
    name: "Easy",
    description: "Learn the JavaScript fundamentals.",
    icon: "🌱",
    color: "#16A34A",
    background: "#F0FDF4",
    levelRange: "Levels 1–20",
    questionCount: "70 Questions",
    unlocked: true,
  },
  {
    name: "Medium",
    description: "Practice your growing JavaScript knowledge.",
    icon: "⚡",
    color: "#2563EB",
    background: "#EFF6FF",
    levelRange: "Levels 21–35",
    questionCount: "70 Questions",
    unlocked: false,
  },
  {
    name: "Hard",
    description: "Challenge yourself with advanced concepts.",
    icon: "🔥",
    color: "#EA580C",
    background: "#FFF7ED",
    levelRange: "Levels 36–45",
    questionCount: "60 Questions",
    unlocked: false,
  },
  {
    name: "Expert",
    description: "Test your mastery of JavaScript.",
    icon: "🏆",
    color: "#9333EA",
    background: "#FAF5FF",
    levelRange: "Levels 46–50",
    questionCount: "50 Questions",
    unlocked: false,
  },
];

export default function DifficultyScreen({ navigation }) {
  // Read the Android/iOS bottom safe area to prevent content
  // and buttons from being hidden behind the system navigation bar.
  const insets = useSafeAreaInsets();

  // Open the level list belonging to the selected difficulty.
  const openDifficulty = (difficulty) => {
    if (!difficulty.unlocked) {
      return;
    }

    navigation.navigate("DifficultyLevels", {
      difficulty: difficulty.name,
    });
  };

  // Open the separate daily challenge screen.
  const openDailyChallenge = () => {
    navigation.navigate("DailyChallenge");
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
      {/* Introduction */}
      <View style={styles.introContainer}>
        <Text style={styles.title}>Choose Your Difficulty</Text>

        <Text style={styles.subtitle}>
          Select your challenge and progress through 50 levels
          to master JavaScript.
        </Text>
      </View>

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

      {DIFFICULTIES.map((difficulty) => (
        <Pressable
          key={difficulty.name}
          onPress={() => openDifficulty(difficulty)}
          disabled={!difficulty.unlocked}
          style={({ pressed }) => [
            styles.difficultyCard,
            !difficulty.unlocked && styles.lockedCard,
            pressed && difficulty.unlocked && styles.pressedCard,
          ]}
        >
          {/* Difficulty icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: difficulty.background },
              !difficulty.unlocked && styles.lockedIconContainer,
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

              {!difficulty.unlocked && (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockBadgeText}>🔒 Locked</Text>
                </View>
              )}

              {difficulty.unlocked && (
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
            {difficulty.unlocked ? "›" : "🔒"}
          </Text>
        </Pressable>
      ))}

      {/* Daily Challenge - separate from the 50 regular levels */}
      <View style={styles.dailySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Special Challenge</Text>

          <Text style={styles.sectionSubtitle}>
            Practice every day with a new challenge.
          </Text>
        </View>

        <Pressable
          onPress={openDailyChallenge}
          style={({ pressed }) => [
            styles.dailyCard,
            pressed && styles.dailyPressed,
          ]}
        >
          <View style={styles.dailyIconContainer}>
            <Text style={styles.dailyIcon}>📅</Text>
          </View>

          <View style={styles.dailyInfo}>
            <View style={styles.dailyTitleRow}>
              <Text style={styles.dailyTitle}>Daily Challenge</Text>

              <View style={styles.dailyBadge}>
                <Text style={styles.dailyBadgeText}>DAILY</Text>
              </View>
            </View>

            <Text style={styles.dailyDescription}>
              Answer 10 randomly selected questions from all
              250 JavaScript questions.
            </Text>

            <Text style={styles.dailyAction}>
              Start today's challenge →
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Main page layout.
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
  },

  // Introduction.
  introContainer: {
    marginBottom: 22,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#172554",
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 21,
  },

  // Overview card.
  overviewCard: {
    backgroundColor: "#172554",
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
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
    backgroundColor: "#334575",
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

  // Section headings.
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

  // Difficulty cards.
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

  // Daily Challenge card.
  dailySection: {
    marginTop: 14,
  },

  dailyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  dailyPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  dailyIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  dailyIcon: {
    fontSize: 28,
  },

  dailyInfo: {
    flex: 1,
  },

  dailyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  dailyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#172554",
  },

  dailyBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  dailyBadgeText: {
    color: "#92400E",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  dailyDescription: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  dailyAction: {
    color: "#B45309",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 9,
  },
});
