
import React, { useEffect, useCallback, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useQuiz } from "../context/QuizContext";

import {
  getStoredData,
  saveStoredData,
} from "../utils/storage";

const REWARD_STORAGE_KEY = "@javascript_mastery:perfect_level_rewards";

const DEFAULT_INVENTORY = {
  hint: 0,
  remove: 0,
};

export default function QuizScreen({ navigation, route }) {
  const allowNavigationRef = useRef(false);
  const rewardUseLockRef = useRef(false);

  const level = route.params?.level || 1;
  const difficulty = route.params?.difficulty || "Easy";

  const {
    quizQuestions,
    currentIndex,
    score,
    selectedAnswer,
    startQuiz,
    selectAnswer,
    nextQuestion,
  } = useQuiz();

  const [inventory, setInventory] = useState(DEFAULT_INVENTORY);
  const [inventoryLoaded, setInventoryLoaded] = useState(false);
  const [removedOptions, setRemovedOptions] = useState([]);
  const [hintVisible, setHintVisible] = useState(false);

  // Load saved rewards and initialize the selected quiz.
  useEffect(() => {
    let mounted = true;

    async function initializeQuiz() {
      allowNavigationRef.current = false;
      setRemovedOptions([]);
      setHintVisible(false);
      setInventoryLoaded(false);

      const storedRewards = await getStoredData(REWARD_STORAGE_KEY, {});
      const savedInventory = storedRewards?.inventory || DEFAULT_INVENTORY;

      if (mounted) {
        setInventory({
          hint: Math.max(0, Number(savedInventory.hint) || 0),
          remove: Math.max(0, Number(savedInventory.remove) || 0),
        });
        setInventoryLoaded(true);
      }

      startQuiz(level, difficulty);
    }

    initializeQuiz();

    return () => {
      mounted = false;
    };
  }, [startQuiz, level, difficulty]);

  // Reset question-specific assistance when moving to another question.
  useEffect(() => {
    setRemovedOptions([]);
    setHintVisible(false);
  }, [currentIndex]);

  // Confirm before leaving an unfinished quiz.
  const confirmExitQuiz = useCallback(() => {
    Alert.alert(
      "Exit Quiz?",
      "Are you sure you want to leave this quiz? Your current progress will be lost.",
      [
        { text: "Stay", style: "cancel" },
        {
          text: "Exit Quiz",
          style: "destructive",
          onPress: () => {
            allowNavigationRef.current = true;
            navigation.replace("DifficultyLevels", { difficulty });
          },
        },
      ],
      { cancelable: true }
    );
  }, [navigation, difficulty]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        confirmExitQuiz();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [confirmExitQuiz])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event) => {
      if (allowNavigationRef.current) return;
      event.preventDefault();
      confirmExitQuiz();
    });

    return unsubscribe;
  }, [navigation, confirmExitQuiz]);

  // Consume one saved reward and update persistent inventory.
  async function consumeReward(rewardType) {
    if (
      !inventoryLoaded ||
      rewardUseLockRef.current ||
      selectedAnswer !== null ||
      inventory[rewardType] <= 0
    ) return false;

    rewardUseLockRef.current = true;

    try {
      const storedRewards = await getStoredData(REWARD_STORAGE_KEY, {});
      const currentInventory = {
        hint: Math.max(0, Number(storedRewards?.inventory?.hint) || 0),
        remove: Math.max(0, Number(storedRewards?.inventory?.remove) || 0),
      };

      if (currentInventory[rewardType] <= 0) {
        setInventory(currentInventory);
        return false;
      }

      const updatedInventory = {
        ...currentInventory,
        [rewardType]: currentInventory[rewardType] - 1,
      };

      await saveStoredData(REWARD_STORAGE_KEY, {
        ...storedRewards,
        inventory: updatedInventory,
      });

      setInventory(updatedInventory);
      return true;
    } catch (error) {
      console.error("Error using reward:", error);
      return false;
    } finally {
      rewardUseLockRef.current = false;
    }
  }

  // Remove one incorrect answer using an earned reward.
  async function handleRemoveOption() {
    if (selectedAnswer !== null || inventory.remove <= 0) return;

    const removableOptions = currentQuestion.options.filter(
      (option) =>
        option !== currentQuestion.answer &&
        !removedOptions.includes(option)
    );

    if (!removableOptions.length) return;

    if (!(await consumeReward("remove"))) return;

    const randomIndex = Math.floor(Math.random() * removableOptions.length);
    const optionToRemove = removableOptions[randomIndex];

    setRemovedOptions((previous) => [...previous, optionToRemove]);
  }

  // Reveal a question hint using an earned reward.
  async function handleShowHint() {
    if (selectedAnswer !== null || inventory.hint <= 0 || hintVisible) return;

    if (await consumeReward("hint")) {
      setHintVisible(true);
    }
  }

  // Move to the next question or open the results screen.
  function handleNextQuestion() {
    const result = nextQuestion();

    if (result?.finished) {
      allowNavigationRef.current = true;
      navigation.replace("Results", {
        score: result.score,
        total: result.total,
        level,
        difficulty,
      });
    }
  }

  if (quizQuestions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingIcon}>📝</Text>
        <Text style={styles.loadingText}>Preparing Level {level}...</Text>
        <Text style={styles.loadingSubtitle}>
          Getting your {difficulty} questions ready.
        </Text>
      </View>
    );
  }

  const currentQuestion = quizQuestions[currentIndex];

  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Preparing your question...</Text>
      </View>
    );
  }

  const isCorrect =
    selectedAnswer !== null &&
    selectedAnswer === currentQuestion.answer;

  const progressPercentage =
    ((currentIndex + 1) / quizQuestions.length) * 100;

  const hintText =
    currentQuestion.hint ||
    "Think carefully about the JavaScript concept in the question. Review what each option does before choosing.";

  return (
    // edges removes the extra top inset while preserving bottom spacing.
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Level information and question progress. */}
        <View style={styles.levelHeader}>
          <View>
            <Text style={styles.difficultyLabel}>
              {difficulty.toUpperCase()} DIFFICULTY
            </Text>
            <Text style={styles.levelTitle}>Level {level}</Text>
          </View>

          <View style={styles.questionCountBadge}>
            <Text style={styles.questionCountText}>
              {quizQuestions.length} Questions
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progress}>
            Question {currentIndex + 1} of {quizQuestions.length}
          </Text>
          <Text style={styles.score}>Score: {score}</Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>

        {/* Current question. */}
        <View style={styles.card}>
          <Text style={styles.questionNumber}>JAVASCRIPT QUESTION</Text>
          <Text style={styles.question}>{currentQuestion.question}</Text>
        </View>

        {/* Earned hint and remove-answer rewards. */}
        <View style={styles.inventoryHeader}>
          <Text style={styles.inventoryTitle}>Your Rewards</Text>
          <Text style={styles.inventorySubtitle}>
            Earn rewards by getting perfect scores.
          </Text>
        </View>

        <View style={styles.assistanceContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.assistanceButton,
              styles.removeButton,
              (inventory.remove <= 0 || selectedAnswer !== null || !inventoryLoaded) &&
                styles.assistanceDisabled,
              pressed && inventory.remove > 0 && selectedAnswer === null &&
                styles.buttonPressed,
            ]}
            onPress={handleRemoveOption}
            disabled={
              inventory.remove <= 0 ||
              selectedAnswer !== null ||
              !inventoryLoaded
            }
          >
            <Text style={styles.assistanceIcon}>✂️</Text>
            <View style={styles.assistanceTextContainer}>
              <Text style={styles.assistanceTitle}>Remove</Text>
              <Text style={styles.assistanceSubtitle}>
                {inventoryLoaded ? `${inventory.remove} available` : "Loading..."}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.assistanceButton,
              styles.hintButton,
              (inventory.hint <= 0 || selectedAnswer !== null ||
                !inventoryLoaded || hintVisible) && styles.assistanceDisabled,
              pressed && inventory.hint > 0 && selectedAnswer === null &&
                styles.buttonPressed,
            ]}
            onPress={handleShowHint}
            disabled={
              inventory.hint <= 0 ||
              selectedAnswer !== null ||
              !inventoryLoaded ||
              hintVisible
            }
          >
            <Text style={styles.assistanceIcon}>💡</Text>
            <View style={styles.assistanceTextContainer}>
              <Text style={styles.assistanceTitle}>Hint</Text>
              <Text style={styles.assistanceSubtitle}>
                {inventoryLoaded ? `${inventory.hint} available` : "Loading..."}
              </Text>
            </View>
          </Pressable>
        </View>

        {hintVisible && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintTitle}>💡 Helpful Hint</Text>
            <Text style={styles.hintText}>{hintText}</Text>
          </View>
        )}

        {/* Answer choices. */}
        <View style={styles.answers}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            if (removedOptions.includes(option)) return null;

            let buttonStyle = styles.answerButton;
            let textStyle = styles.answerText;

            if (isSelected && isCorrect) {
              buttonStyle = [styles.answerButton, styles.correct];
              textStyle = [styles.answerText, styles.correctText];
            } else if (isSelected && !isCorrect) {
              buttonStyle = [styles.answerButton, styles.wrong];
              textStyle = [styles.answerText, styles.wrongText];
            }

            return (
              <Pressable
                key={`${currentQuestion.id}-${index}`}
                style={({ pressed }) => [
                  buttonStyle,
                  pressed && selectedAnswer === null && styles.answerPressed,
                ]}
                onPress={() => selectAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                <Text style={textStyle}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Show explanation only when the selected answer is correct. */}
        {selectedAnswer !== null && (
          <View
            style={[
              styles.feedback,
              isCorrect ? styles.correctFeedbackBox : styles.wrongFeedbackBox,
            ]}
          >
            <Text
              style={[
                styles.feedbackTitle,
                isCorrect ? styles.correctFeedbackTitle : styles.wrongFeedbackTitle,
              ]}
            >
              {isCorrect ? "✓ Correct!" : "✕ Incorrect!"}
            </Text>

            {isCorrect && (
              <Text style={styles.feedbackText}>
                {currentQuestion.explanation}
              </Text>
            )}
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            selectedAnswer === null && styles.disabled,
            pressed && selectedAnswer !== null && styles.nextPressed,
          ]}
          disabled={selectedAnswer === null}
          onPress={handleNextQuestion}
        >
          <Text style={styles.nextText}>
            {currentIndex === quizQuestions.length - 1
              ? "Finish Level"
              : "Next Question →"}
          </Text>
        </Pressable>
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
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8FAFC",
  },

  loadingIcon: {
    fontSize: 42,
    marginBottom: 15,
  },

  loadingText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#172554",
  },

  loadingSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 7,
  },

  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  difficultyLabel: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  levelTitle: {
    color: "#172554",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 4,
  },

  questionCountBadge: {
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  questionCountText: {
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: "800",
  },

  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progress: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  score: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2563EB",
  },

  progressBar: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    marginTop: 12,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 10,
  },

  card: {
    backgroundColor: "#172554",
    borderRadius: 24,
    padding: 25,
    marginTop: 25,
    minHeight: 210,
    justifyContent: "center",
  },

  questionNumber: {
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 15,
  },

  question: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 34,
  },

  inventoryHeader: {
    marginTop: 22,
    marginBottom: 10,
  },

  inventoryTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#172554",
  },

  inventorySubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },

  assistanceContainer: {
    flexDirection: "row",
    gap: 12,
  },

  assistanceButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderRadius: 15,
    borderWidth: 1,
    gap: 9,
  },

  removeButton: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },

  hintButton: {
    backgroundColor: "#FEFCE8",
    borderColor: "#FDE68A",
  },

  assistanceDisabled: {
    opacity: 0.4,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  assistanceIcon: {
    fontSize: 22,
  },

  assistanceTextContainer: {
    flex: 1,
  },

  assistanceTitle: {
    color: "#172554",
    fontSize: 14,
    fontWeight: "900",
  },

  assistanceSubtitle: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 3,
    fontWeight: "600",
  },

  hintContainer: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    marginTop: 13,
  },

  hintTitle: {
    color: "#92400E",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
  },

  hintText: {
    color: "#78350F",
    fontSize: 14,
    lineHeight: 21,
  },

  answers: {
    marginTop: 20,
    gap: 12,
  },

  answerButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 17,
    borderRadius: 15,
  },

  answerPressed: {
    opacity: 0.7,
  },

  answerText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },

  correct: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
  },

  correctText: {
    color: "#166534",
  },

  wrong: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },

  wrongText: {
    color: "#991B1B",
  },

  feedback: {
    padding: 16,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
  },

  correctFeedbackBox: {
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
  },

  wrongFeedbackBox: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },

  feedbackTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  correctFeedbackTitle: {
    color: "#15803D",
  },

  wrongFeedbackTitle: {
    color: "#DC2626",
  },

  feedbackText: {
    color: "#64748B",
    marginTop: 6,
    lineHeight: 20,
  },

  nextButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 17,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },

  disabled: {
    backgroundColor: "#CBD5E1",
  },

  nextPressed: {
    opacity: 0.8,
  },

  nextText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
});
