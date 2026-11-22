import React, { useEffect, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useFocusEffect } from "@react-navigation/native";

import { useQuiz } from "../context/QuizContext";

// Determines the number of questions for each level.
const getLevelQuestionCount = (level) => {
  if (level <= 10) return 3;
  if (level <= 25) return 4;
  if (level <= 35) return 5;
  if (level <= 45) return 6;
  return 10;
};

export default function QuizScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  // Receive the selected level and difficulty.
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

  // Initialize the selected level's quiz.
  useEffect(() => {
    startQuiz(level, difficulty);
  }, [startQuiz, level, difficulty]);

  // Shows a confirmation before leaving the current quiz.
  const confirmExitQuiz = useCallback(() => {
    Alert.alert(
      "Exit Quiz?",
      "Are you sure you want to leave this quiz? Your current progress will be lost.",
      [
        {
          text: "Stay",
          style: "cancel",
        },
        {
          text: "Exit Quiz",
          style: "destructive",
          onPress: () => {
            navigation.replace("DifficultyLevels", {
              difficulty,
            });
          },
        },
      ],
      { cancelable: true }
    );
  }, [navigation, difficulty]);

  // Handles the Android hardware back button.
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

  // Prevents navigation away from the quiz without confirmation.
  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "beforeRemove",
      (event) => {
        // Allow navigation when the quiz has been completed.
        if (event.data.action.type === "REPLACE" &&
            event.data.action.payload?.name === "Results") {
          return;
        }

        // Prevent the default navigation action.
        event.preventDefault();

        // Ask the user whether they want to leave.
        confirmExitQuiz();
      }
    );

    return unsubscribe;
  }, [navigation, confirmExitQuiz]);

  // Show a loading screen while questions are being prepared.
  if (quizQuestions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>📝</Text>

          <Text style={styles.loadingText}>
            Preparing Level {level}...
          </Text>

          <Text style={styles.loadingSubtitle}>
            Getting your {difficulty} questions ready.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get the currently displayed question.
  const currentQuestion = quizQuestions[currentIndex];

  // Calculate question progress.
  const progressPercentage =
    ((currentIndex + 1) / quizQuestions.length) * 100;

  // Move to the next question or show the results.
  function handleNextQuestion() {
    const result = nextQuestion();

    if (result?.finished) {
      navigation.replace("Results", {
        score: result.score,
        total: result.total,
        level,
        difficulty,
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 20,
          },
        ]}
      >
        {/* LEVEL INFORMATION */}
        <View style={styles.levelHeader}>
          <View>
            <Text style={styles.difficultyLabel}>
              {difficulty.toUpperCase()} DIFFICULTY
            </Text>

            <Text style={styles.levelTitle}>
              Level {level}
            </Text>
          </View>

          <View style={styles.questionCountBadge}>
            <Text style={styles.questionCountText}>
              {quizQuestions.length} Questions
            </Text>
          </View>
        </View>

        {/* QUESTION PROGRESS AND SCORE */}
        <View style={styles.progressContainer}>
          <Text style={styles.progress}>
            Question {currentIndex + 1} of {quizQuestions.length}
          </Text>

          <Text style={styles.score}>
            Score: {score}
          </Text>
        </View>

        {/* PROGRESS BAR */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>

        {/* QUESTION CARD */}
        <View style={styles.card}>
          <Text style={styles.questionNumber}>
            JAVASCRIPT QUESTION
          </Text>

          <Text style={styles.question}>
            {currentQuestion.question}
          </Text>
        </View>

        {/* ANSWER OPTIONS */}
        <View style={styles.answers}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.answer;

            let buttonStyle = styles.answerButton;
            let textStyle = styles.answerText;

            // Highlight the correct answer after selection.
            if (selectedAnswer !== null && isCorrect) {
              buttonStyle = [
                styles.answerButton,
                styles.correct,
              ];

              textStyle = [
                styles.answerText,
                styles.correctText,
              ];
            }

            // Highlight the selected incorrect answer.
            else if (isSelected) {
              buttonStyle = [
                styles.answerButton,
                styles.wrong,
              ];

              textStyle = [
                styles.answerText,
                styles.wrongText,
              ];
            }

            return (
              <Pressable
                key={`${currentQuestion.id}-${index}`}
                style={({ pressed }) => [
                  buttonStyle,
                  pressed &&
                    selectedAnswer === null &&
                    styles.answerPressed,
                ]}
                onPress={() => selectAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                <Text style={textStyle}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ANSWER FEEDBACK */}
        {selectedAnswer !== null && (
          <View style={styles.feedback}>
            <Text
              style={[
                styles.feedbackTitle,
                selectedAnswer === currentQuestion.answer
                  ? styles.correctFeedback
                  : styles.wrongFeedback,
              ]}
            >
              {selectedAnswer === currentQuestion.answer
                ? "✓ Correct!"
                : "✕ Not quite!"}
            </Text>

            <Text style={styles.feedbackText}>
              {currentQuestion.explanation}
            </Text>
          </View>
        )}

        {/* NEXT QUESTION BUTTON */}
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            selectedAnswer === null && styles.disabled,
            pressed &&
              selectedAnswer !== null &&
              styles.nextPressed,
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
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  feedbackTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  correctFeedback: {
    color: "#15803D",
  },

  wrongFeedback: {
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
