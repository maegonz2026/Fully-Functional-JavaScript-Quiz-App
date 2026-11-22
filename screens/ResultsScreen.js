
import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, Pressable, ScrollView,
  Modal, StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getStoredData, saveStoredData, STORAGE_KEYS,
} from "../utils/storage";

const PASSING_PERCENTAGE = 65;
const LEVEL_PROGRESS_KEY = "@javascript_mastery:level_progress";
const REWARD_STORAGE_KEY = "@javascript_mastery:perfect_level_rewards";

const DIFFICULTY_RANGES = {
  Easy: { start: 1, end: 20 },
  Medium: { start: 21, end: 35 },
  Hard: { start: 36, end: 45 },
  Expert: { start: 46, end: 50 },
};

const DEFAULT_REWARD_DATA = {
  perfectLevels: [],
  rewardsGranted: 0,
  inventory: { hint: 0, remove: 0 },
  rewardHistory: [],
};

export default function ResultsScreen({ navigation, route }) {
  const total = Math.max(0, Math.floor(Number(route.params?.total) || 0));
  const score = Math.min(total, Math.max(0, Math.floor(Number(route.params?.score) || 0)));
  const levelNumber = Number(route.params?.level);
  const difficulty = route.params?.difficulty;
  const difficultyRange = DIFFICULTY_RANGES[difficulty];

  const isLevelQuiz =
    difficultyRange &&
    Number.isInteger(levelNumber) &&
    levelNumber >= difficultyRange.start &&
    levelNumber <= difficultyRange.end;

  const percentage = total ? Math.round((score / total) * 100) : 0;
  const requiredScore = total ? Math.ceil(total * PASSING_PERCENTAGE / 100) : 0;
  const passed = total > 0 && score >= requiredScore;
  const additionalCorrectAnswers = Math.max(0, requiredScore - score);
  const isLastLevel = isLevelQuiz && levelNumber === difficultyRange.end;

  const resultRef = useRef(null);
  const savePromiseRef = useRef(null);

  const [rewardPopup, setRewardPopup] = useState(null);
  const [rewardData, setRewardData] = useState(DEFAULT_REWARD_DATA);
  const [saving, setSaving] = useState(true);

  if (!resultRef.current) {
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

  // Save quiz history, level progress, and any newly earned rewards.
  useEffect(() => {
    async function saveQuizResult() {
      try {
        const result = resultRef.current;

        // Save quiz history without duplicating this result.
        const previousResults = await getStoredData(STORAGE_KEYS.QUIZ_HISTORY, []);
        const quizHistory = Array.isArray(previousResults) ? previousResults : [];

        if (!quizHistory.some((item) => item.id === result.id)) {
          await saveStoredData(STORAGE_KEYS.QUIZ_HISTORY, [...quizHistory, result]);
        }

        // Record passed levels.
        if (isLevelQuiz && passed) {
          const previousProgress = await getStoredData(LEVEL_PROGRESS_KEY, {});
          const progress = previousProgress && typeof previousProgress === "object" && !Array.isArray(previousProgress)
            ? previousProgress
            : {};

          const completedLevels = [...new Set(
            (Array.isArray(progress.completedLevels) ? progress.completedLevels : [])
              .map(Number)
              .filter((item) => Number.isInteger(item) && item >= 1 && item <= 50)
          )];

          if (!completedLevels.includes(levelNumber)) {
            completedLevels.push(levelNumber);
            completedLevels.sort((a, b) => a - b);
            await saveStoredData(LEVEL_PROGRESS_KEY, { ...progress, completedLevels });
          }
        }

        // Only a perfect level contributes to reward progress.
        if (!isLevelQuiz || percentage !== 100 || total === 0) return;

        const stored = await getStoredData(REWARD_STORAGE_KEY, DEFAULT_REWARD_DATA);
        const current = {
          ...DEFAULT_REWARD_DATA,
          ...(stored || {}),
          inventory: {
            hint: Math.max(0, Number(stored?.inventory?.hint) || 0),
            remove: Math.max(0, Number(stored?.inventory?.remove) || 0),
          },
        };

        // Keep each perfect level unique.
        const perfectLevels = [...new Set(
          (Array.isArray(current.perfectLevels) ? current.perfectLevels : [])
            .map(Number)
            .filter((item) => Number.isInteger(item) && item >= 1 && item <= 50)
        )];

        if (!perfectLevels.includes(levelNumber)) {
          perfectLevels.push(levelNumber);
          perfectLevels.sort((a, b) => a - b);
        }

        // Every two different perfect levels grant one random reward.
        const earnedPairs = Math.floor(perfectLevels.length / 2);
        const rewardsGranted = Math.max(0, Number(current.rewardsGranted) || 0);
        const newRewardsCount = Math.max(0, earnedPairs - rewardsGranted);
        const inventory = { ...current.inventory };
        const newRewards = [];

        for (let i = 0; i < newRewardsCount; i++) {
          const type = Math.random() < 0.5 ? "hint" : "remove";
          inventory[type]++;
          newRewards.push(type);
        }

        const updatedData = {
          perfectLevels,
          rewardsGranted: rewardsGranted + newRewardsCount,
          inventory,
          rewardHistory: [
            ...(Array.isArray(current.rewardHistory) ? current.rewardHistory : []),
            ...newRewards.map((type) => ({
              type,
              earnedAt: new Date().toISOString(),
            })),
          ],
        };

        await saveStoredData(REWARD_STORAGE_KEY, updatedData);
        setRewardData(updatedData);

        if (newRewards.length) setRewardPopup(newRewards);
      } catch (error) {
        console.error("Error saving quiz result:", error);
      } finally {
        setSaving(false);
      }
    }

    if (!savePromiseRef.current) {
      savePromiseRef.current = saveQuizResult();
    }
  }, [isLevelQuiz, passed, percentage, total, levelNumber]);

  // Navigation actions.
  function tryAgain() {
    navigation.replace("Quiz", isLevelQuiz ? { level: levelNumber, difficulty } : undefined);
  }

  function goToNextLevel() {
    if (isLevelQuiz && passed && !isLastLevel) {
      navigation.replace("Quiz", { level: levelNumber + 1, difficulty });
    }
  }

  function goToLevels() {
    navigation.replace(isLevelQuiz ? "DifficultyLevels" : "Home",
      isLevelQuiz ? { difficulty } : undefined);
  }

  function goBack() {
    navigation.canGoBack() ? navigation.goBack() : goToLevels();
  }

  // Result feedback message.
  function getResultMessage() {
    if (!isLevelQuiz) {
      return percentage >= 80
        ? "Excellent JavaScript knowledge! Keep up the great work."
        : percentage >= 60
        ? "Good job! Continue practicing to improve your JavaScript skills."
        : "Keep practicing! Review what you have learned and try again.";
    }

    if (passed && percentage === 100) {
      return `Perfect score! You answered all ${total} questions correctly and successfully completed ${difficulty} Level ${levelNumber}.`;
    }

    if (passed && isLastLevel) {
      return `Congratulations! You completed ${difficulty} difficulty by passing Level ${levelNumber}. You can now return to the difficulty selection screen.`;
    }

    if (passed) {
      return `Congratulations! You answered ${score} out of ${total} questions correctly (${percentage}%). You met the ${PASSING_PERCENTAGE}% passing requirement. Level ${levelNumber + 1} is now available!`;
    }

    return `You answered ${score} out of ${total} questions correctly (${percentage}%). You needed at least ${requiredScore} correct answers to meet the ${PASSING_PERCENTAGE}% passing requirement. You needed ${additionalCorrectAnswers} more correct ${additionalCorrectAnswers === 1 ? "answer" : "answers"} to pass. Review the material and try again!`;
  }

  const perfectLevelCount = rewardData.perfectLevels.length;
  const remainingForReward = perfectLevelCount % 2 === 0 ? 2 : 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.resultIcon, passed ? styles.successIcon : styles.failedIcon]}>
            <Text style={styles.resultIconText}>{passed ? "✓" : "✕"}</Text>
          </View>

          <Text style={styles.title}>
            {isLevelQuiz ? passed ? "Level Passed!" : "Level Not Passed" : "Quiz Complete!"}
          </Text>

          <Text style={styles.subtitle}>
            {isLevelQuiz ? `${difficulty} • Level ${levelNumber}` : "Here is your final result."}
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>YOUR FINAL SCORE</Text>
          <Text style={[styles.percentage, passed ? styles.successText : styles.failedText]}>
            {percentage}%
          </Text>
          <Text style={styles.scoreDetails}>{score} correct out of {total} questions</Text>

          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, {
              width: `${Math.min(100, percentage)}%`,
              backgroundColor: passed ? "#16a34a" : "#ef4444",
            }]} />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>0%</Text>
            <Text style={styles.progressLabel}>100%</Text>
          </View>

          {isLevelQuiz && (
            <View style={[styles.statusBadge, passed ? styles.passedBadge : styles.failedBadge]}>
              <Text style={[styles.statusText, passed ? styles.successText : styles.failedText]}>
                {passed ? "✓ LEVEL PASSED" : "✕ LEVEL NOT PASSED"}
              </Text>
            </View>
          )}
        </View>

        {isLevelQuiz && percentage === 100 && (
          <View style={styles.perfectCard}>
            <Text style={styles.perfectTitle}>🌟 Perfect Level!</Text>
            <Text style={styles.perfectMessage}>
              This level has been counted toward your perfect-level rewards.
              Every 2 different perfect levels earn you 1 random reward.
            </Text>
            <Text style={styles.perfectProgress}>
              {saving ? "Checking your rewards..." : `${perfectLevelCount} perfect levels recorded`}
            </Text>
            {!saving && (
              <Text style={styles.perfectRemaining}>
                {remainingForReward} more perfect {remainingForReward === 1 ? "level" : "levels"} until your next reward.
              </Text>
            )}
          </View>
        )}

        <View style={[styles.feedbackCard, passed ? styles.successFeedback : styles.failedFeedback]}>
          <Text style={styles.feedbackTitle}>{passed ? "Well Done!" : "Keep Practicing!"}</Text>
          <Text style={styles.feedbackMessage}>{getResultMessage()}</Text>
        </View>

        <View style={styles.buttons}>
          {isLevelQuiz && passed && !isLastLevel && (
            <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} onPress={goToNextLevel}>
              <Text style={styles.primaryText}>Next Level →</Text>
            </Pressable>
          )}

          {isLevelQuiz && passed && isLastLevel && (
            <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} onPress={goToLevels}>
              <Text style={styles.primaryText}>View Difficulties →</Text>
            </Pressable>
          )}

          {(!isLevelQuiz || !passed) && (
            <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} onPress={tryAgain}>
              <Text style={styles.primaryText}>↻ Try Again</Text>
            </Pressable>
          )}

          <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]} onPress={goBack}>
            <Text style={styles.secondaryText}>← Back</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Full-screen reward popup. */}
      <Modal
        visible={rewardPopup !== null}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        onRequestClose={() => setRewardPopup(null)}
      >
        <View style={styles.modalOverlay}>
          <StatusBar backgroundColor="transparent" translucent={true} barStyle="light-content" />

          <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom", "left", "right"]}>
            <View style={styles.rewardModal}>
              <Text style={styles.rewardEmoji}>🎁</Text>
              <Text style={styles.rewardTitle}>Perfect Level Reward!</Text>

              <Text style={styles.rewardDescription}>
                You earned {rewardPopup?.length || 0} new {rewardPopup?.length === 1 ? "reward" : "rewards"}!
              </Text>

              {rewardPopup?.map((reward, index) => (
                <View key={`${reward}-${index}`} style={styles.rewardItem}>
                  <Text style={styles.rewardItemIcon}>{reward === "hint" ? "💡" : "✂️"}</Text>
                  <View style={styles.rewardItemTextContainer}>
                    <Text style={styles.rewardItemTitle}>
                      {reward === "hint" ? "1 Hint" : "1 Remove One Answer"}
                    </Text>
                    <Text style={styles.rewardItemSubtitle}>Added to your reward inventory</Text>
                  </View>
                </View>
              ))}

              <Pressable
                style={({ pressed }) => [styles.rewardButton, pressed && styles.buttonPressed]}
                onPress={() => setRewardPopup(null)}
              >
                <Text style={styles.rewardButtonText}>Awesome!</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

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

  perfectCard: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderWidth: 1,
    padding: 18,
    borderRadius: 18,
    marginTop: 18,
  },

  perfectTitle: {
    color: "#1d4ed8",
    fontSize: 17,
    fontWeight: "900",
  },

  perfectMessage: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  perfectProgress: {
    color: "#1e40af",
    fontWeight: "800",
    fontSize: 13,
    marginTop: 12,
  },

  perfectRemaining: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 5,
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

  modalOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalSafeArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  rewardModal: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#ffffff",
    borderRadius: 25,
    padding: 24,
    alignItems: "center",
    elevation: 15,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },

  rewardEmoji: {
    fontSize: 54,
    marginBottom: 12,
  },

  rewardTitle: {
    color: "#172554",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  rewardDescription: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 7,
    marginBottom: 18,
    textAlign: "center",
  },

  rewardItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 15,
    padding: 14,
    marginBottom: 10,
  },

  rewardItemIcon: {
    fontSize: 27,
    marginRight: 13,
  },

  rewardItemTextContainer: {
    flex: 1,
  },

  rewardItemTitle: {
    color: "#172554",
    fontSize: 15,
    fontWeight: "900",
  },

  rewardItemSubtitle: {
    color: "#64748b",
    fontSize: 11,
    marginTop: 3,
  },

  rewardButton: {
    backgroundColor: "#2563eb",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },

  rewardButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
});
