
import React, { useEffect, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  getStoredData,
  saveStoredData,
  STORAGE_KEYS,
} from "../utils/storage";

// Passing percentage required to complete a level.
const PASSING_PERCENTAGE = 75;

// AsyncStorage key for completed level progress.
const LEVEL_PROGRESS_KEY = "@javascript_mastery:level_progress";

// Valid level ranges for each difficulty.
const DIFFICULTY_RANGES = {
  Easy: { start: 1, end: 20 },
  Medium: { start: 21, end: 35 },
  Hard: { start: 36, end: 45 },
  Expert: { start: 46, end: 50 },
};

export default function ResultsScreen({ navigation, route }) {
  // Get the result information passed from QuizScreen.
  const rawScore = Number(route.params?.score ?? 0);
  const rawTotal = Number(route.params?.total ?? 0);

  // Make sure score and total are valid numbers.
  const total = Number.isFinite(rawTotal)
    ? Math.max(0, Math.floor(rawTotal))
    : 0;

  const score = Number.isFinite(rawScore)
    ? Math.min(total, Math.max(0, Math.floor(rawScore)))
    : 0;

  const level = route.params?.level ?? null;
  const difficulty = route.params?.difficulty ?? null;

  // Validate whether this result belongs to a valid level quiz.
  const levelNumber = Number(level);
  const difficultyRange = DIFFICULTY_RANGES[difficulty];

  const isLevelQuiz =
    difficultyRange !== undefined &&
    Number.isInteger(levelNumber) &&
    levelNumber >= difficultyRange.start &&
    levelNumber <= difficultyRange.end;

  // Calculate the player's percentage.
  const percentage =
    total > 0 ? Math.round((score / total) * 100) : 0;

  // Calculate the minimum correct answers required to pass.
  const requiredScore =
    total > 0
      ? Math.ceil((total * PASSING_PERCENTAGE) / 100)
      : 0;

  // Determine whether the player passed.
  const passed =
    total > 0 && score >= requiredScore;

  // Calculate how many additional correct answers were needed.
  const additionalCorrectAnswers = Math.max(
    0,
    requiredScore - score
  );

  // Keep one result ID while this screen is mounted.
  // This prevents duplicate history entries during re-renders.
  const resultRef = useRef(null);

  // Prevent multiple save operations from running simultaneously.
  const savePromiseRef = useRef(null);

  if (resultRef.current === null) {
    resultRef.current = {
      id: Date.now().toString(),
      score,
      total,
      percentage,
      completedAt: new Date().toISOString(),
      level: isLevelQuiz ? levelNumber : null,
      difficulty: isLevelQuiz ? difficulty : null,
      passed,
    };
  }

  // Save quiz history and completed level progress.
  useEffect(() => {
    async function saveQuizResult() {
      try {
        const result = resultRef.current;

        // ---------------------------------------
        // SAVE QUIZ HISTORY
        // ---------------------------------------

        const previousResults = await getStoredData(
          STORAGE_KEYS.QUIZ_HISTORY,
          []
        );

        const quizHistory = Array.isArray(previousResults)
          ? previousResults
          : [];

        const alreadySaved = quizHistory.some(
          (item) => item.id === result.id
        );

        if (!alreadySaved) {
          await saveStoredData(
            STORAGE_KEYS.QUIZ_HISTORY,
            [...quizHistory, result]
          );
        }

        // ---------------------------------------
        // SAVE COMPLETED LEVEL PROGRESS
        // ---------------------------------------

        // Only level quizzes that meet the passing
        // requirement can update level progress.
        if (isLevelQuiz && passed) {
          const previousProgress = await getStoredData(
            LEVEL_PROGRESS_KEY,
            {}
          );

          // Protect against invalid stored data.
          const progress =
            previousProgress &&
            typeof previousProgress === "object" &&
            !Array.isArray(previousProgress)
              ? previousProgress
              : {};

          const storedLevels = Array.isArray(
            progress.completedLevels
          )
            ? progress.completedLevels
            : [];

          // Normalize and remove invalid or duplicate levels.
          const completedLevels = [
            ...new Set(
              storedLevels
                .map(Number)
                .filter(
                  (item) =>
                    Number.isInteger(item) &&
                    item >= 1 &&
                    item <= 50
                )
            ),
          ];

          // Add the newly completed level only once.
          if (!completedLevels.includes(levelNumber)) {
            completedLevels.push(levelNumber);

            completedLevels.sort((a, b) => a - b);

            await saveStoredData(LEVEL_PROGRESS_KEY, {
              ...progress,
              completedLevels,
            });
          }
        }
      } catch (error) {
        console.error("Error saving quiz results:", error);
      }
    }

    // Run the save operation only once per mounted result screen.
    if (!savePromiseRef.current) {
      savePromiseRef.current = saveQuizResult();
    }
  }, [isLevelQuiz, passed, levelNumber]);

  // Restart the same level or general quiz.
  function tryAgain() {
    if (isLevelQuiz) {
      navigation.replace("Quiz", {
        level: levelNumber,
        difficulty,
      });
    } else {
      navigation.replace("Quiz");
    }
  }

  // Return to the previous screen.
  function goBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (isLevelQuiz) {
      navigation.replace("DifficultyLevels", {
        difficulty,
      });
    } else {
      navigation.replace("Home");
    }
  }

  // Display feedback based on the player's result.
  function getResultMessage() {
    // General quizzes and daily challenges.
    if (!isLevelQuiz) {
      return percentage >= 80
        ? "Excellent JavaScript knowledge! Keep up the great work."
        : percentage >= 60
        ? "Good job! Continue practicing to improve your JavaScript skills."
        : "Keep practicing! Review what you have learned and try again.";
    }

    // Perfect score.
    if (passed && percentage === 100) {
      return `Perfect score! You answered all ${total} questions correctly and successfully completed ${difficulty} Level ${levelNumber}.`;
    }

    // Passed with at least 75%.
    if (passed) {
      return `Congratulations! You answered ${score} out of ${total} questions correctly (${percentage}%). You met the ${PASSING_PERCENTAGE}% passing requirement and successfully completed ${difficulty} Level ${levelNumber}. You can now proceed to the next level.`;
    }

    // Failed to meet the passing requirement.
    return `You answered ${score} out of ${total} questions correctly (${percentage}%). You needed at least ${requiredScore} correct answers to meet the ${PASSING_PERCENTAGE}% passing requirement.`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* RESULT HEADER */}
        <View style={styles.header}>
          <View
            style={[
              styles.resultIcon,
              passed ? styles.successIcon : styles.failedIcon,
            ]}
          >
            <Text style={styles.resultIconText}>
              {passed ? "✓" : "✕"}
            </Text>
          </View>

          <Text style={styles.title}>
            {isLevelQuiz
              ? passed
                ? "Level Passed!"
                : "Level Not Passed"
              : "Quiz Complete!"}
          </Text>

          <Text style={styles.subtitle}>
            {isLevelQuiz
              ? `${difficulty} • Level ${levelNumber}`
              : "Here is your final result."}
          </Text>
        </View>

        {/* SCORE CARD */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>
            YOUR FINAL SCORE
          </Text>

          <Text
            style={[
              styles.percentage,
              passed ? styles.successText : styles.failedText,
            ]}
          >
            {percentage}%
          </Text>

          <Text style={styles.scoreDetails}>
            {score} correct out of {total} questions
          </Text>

          {/* PROGRESS BAR */}
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, percentage)}%`,
                  backgroundColor: passed ? "#16a34a" : "#ef4444",
                },
              ]}
            />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>0%</Text>
            <Text style={styles.progressLabel}>100%</Text>
          </View>

          {isLevelQuiz && (
            <View
              style={[
                styles.statusBadge,
                passed ? styles.passedBadge : styles.failedBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  passed ? styles.successText : styles.failedText,
                ]}
              >
                {passed ? "✓ LEVEL PASSED" : "✕ LEVEL NOT PASSED"}
              </Text>
            </View>
          )}
        </View>

        {/* FEEDBACK */}
        <View
          style={[
            styles.feedbackCard,
            passed ? styles.successFeedback : styles.failedFeedback,
          ]}
        >
          <Text style={styles.feedbackTitle}>
            {passed ? "Well Done!" : "Keep Practicing!"}
          </Text>

          <Text style={styles.feedbackMessage}>
            {getResultMessage()}
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={tryAgain}
          >
            <Text style={styles.primaryText}>
              ↻  Try Again
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={goBack}
          >
            <Text style={styles.secondaryText}>
              ←  Back
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 25,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  resultIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  successIcon: {
    backgroundColor: "#dcfce7",
  },

  failedIcon: {
    backgroundColor: "#fee2e2",
  },

  resultIconText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#172554",
  },

  title: {
    fontSize: 29,
    fontWeight: "900",
    color: "#172554",
    marginTop: 20,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 7,
    fontWeight: "500",
  },

  scoreCard: {
    backgroundColor: "#ffffff",
    borderRadius: 26,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 3,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },

  scoreLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 1.5,
  },

  percentage: {
    fontSize: 65,
    fontWeight: "900",
    marginTop: 8,
  },

  successText: {
    color: "#16a34a",
  },

  failedText: {
    color: "#dc2626",
  },

  scoreDetails: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 2,
  },

  progressBackground: {
    width: "100%",
    height: 11,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
    marginTop: 25,
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
  },

  progressLabels: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  progressLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
  },

  statusBadge: {
    marginTop: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  passedBadge: {
    backgroundColor: "#dcfce7",
  },

  failedBadge: {
    backgroundColor: "#fee2e2",
  },

  statusText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  feedbackCard: {
    padding: 18,
    borderRadius: 18,
    marginTop: 18,
  },

  successFeedback: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },

  failedFeedback: {
    backgroundColor: "#fff1f2",
    borderWidth: 1,
    borderColor: "#fecdd3",
  },

  feedbackTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#172554",
  },

  feedbackMessage: {
    fontSize: 13,
    lineHeight: 20,
    color: "#475569",
    marginTop: 5,
  },

  buttons: {
    marginTop: 25,
    gap: 12,
  },

  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 17,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
  },

  primaryText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },

  secondaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },

  secondaryText: {
    color: "#1e40af",
    fontSize: 15,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
