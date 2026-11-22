
import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";

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

export default function QuizScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  // Allows navigation only after confirmation or quiz completion.
  const allowNavigationRef = useRef(false);

  // Receives the selected level and difficulty.
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

  // Tracks Remove and Hint usage for this level attempt.
  const [removeUses, setRemoveUses] = useState(0);
  const [hintUses, setHintUses] = useState(0);

  // Stores the answer choices removed from the current question.
  const [removedOptions, setRemovedOptions] = useState([]);

  // Controls whether the current question's hint is visible.
  const [hintVisible, setHintVisible] = useState(false);

  // Initializes the selected level's quiz.
  useEffect(() => {
    allowNavigationRef.current = false;

    setRemoveUses(0);
    setHintUses(0);
    setRemovedOptions([]);
    setHintVisible(false);

    startQuiz(level, difficulty);
  }, [startQuiz, level, difficulty]);

  // Resets question-specific assistance when moving to another question.
  useEffect(() => {
    setRemovedOptions([]);
    setHintVisible(false);
  }, [currentIndex]);

  // Displays an exit confirmation.
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
            allowNavigationRef.current = true;

            navigation.replace("DifficultyLevels", {
              difficulty,
            });
          },
        },
      ],
      { cancelable: true }
    );
  }, [navigation, difficulty]);

  // Handles the Android hardware Back button.
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

  // Prevents leaving the quiz without confirmation.
  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "beforeRemove",
      (event) => {
        if (allowNavigationRef.current) {
          return;
        }

        event.preventDefault();
        confirmExitQuiz();
      }
    );

    return unsubscribe;
  }, [navigation, confirmExitQuiz]);

  // Displays a loading screen while questions are prepared.
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

  // Gets the currently displayed question.
  const currentQuestion = quizQuestions[currentIndex];

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Preparing your question...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Checks whether the selected answer is correct.
  const isCorrect =
    selectedAnswer !== null &&
    selectedAnswer === currentQuestion.answer;

  // Calculates question progress.
  const progressPercentage =
    ((currentIndex + 1) / quizQuestions.length) * 100;

  // Removes one randomly selected incorrect option.
  function handleRemoveOption() {
    if (
      selectedAnswer !== null ||
      removeUses >= 3
    ) {
      return;
    }

    // Gets incorrect options that have not already been removed.
    const removableOptions = currentQuestion.options.filter(
      (option) =>
        option !== currentQuestion.answer &&
        !removedOptions.includes(option)
    );

    if (removableOptions.length === 0) {
      return;
    }

    // Randomly chooses one incorrect option.
    const randomIndex = Math.floor(
      Math.random() * removableOptions.length
    );

    const optionToRemove = removableOptions[randomIndex];

    setRemovedOptions((previous) => [
      ...previous,
      optionToRemove,
    ]);

    setRemoveUses((previous) => previous + 1);
  }

  // Displays a hint once per level attempt.
  function handleShowHint() {
    if (
      selectedAnswer !== null ||
      hintUses >= 1 ||
      hintVisible
    ) {
      return;
    }

    setHintUses((previous) => previous + 1);
    setHintVisible(true);
  }

  // Moves to the next question or displays the results.
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

  // Uses the question's hint property when available.
  const hintText =
    currentQuestion.hint ||
    "Think carefully about the JavaScript concept in the question. Review what each option does before choosing.";

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
              { width: `${progressPercentage}%` },
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

        {/* REMOVE AND HINT BUTTONS */}
        <View style={styles.assistanceContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.assistanceButton,
              styles.removeButton,
              (removeUses >= 3 || selectedAnswer !== null) &&
                styles.assistanceDisabled,
              pressed &&
                removeUses < 3 &&
                selectedAnswer === null &&
                styles.buttonPressed,
            ]}
            onPress={handleRemoveOption}
            disabled={
              removeUses >= 3 ||
              selectedAnswer !== null
            }
          >
            <Text style={styles.assistanceIcon}>✂️</Text>

            <View style={styles.assistanceTextContainer}>
              <Text style={styles.assistanceTitle}>
                Remove
              </Text>

              <Text style={styles.assistanceSubtitle}>
                {3 - removeUses} uses left
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.assistanceButton,
              styles.hintButton,
              (hintUses >= 1 || selectedAnswer !== null) &&
                styles.assistanceDisabled,
              pressed &&
                hintUses < 1 &&
                selectedAnswer === null &&
                styles.buttonPressed,
            ]}
            onPress={handleShowHint}
            disabled={
              hintUses >= 1 ||
              selectedAnswer !== null
            }
          >
            <Text style={styles.assistanceIcon}>💡</Text>

            <View style={styles.assistanceTextContainer}>
              <Text style={styles.assistanceTitle}>
                Hint
              </Text>

              <Text style={styles.assistanceSubtitle}>
                {1 - hintUses} use left
              </Text>
            </View>
          </Pressable>
        </View>

        {/* HINT DISPLAY */}
        {hintVisible && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintTitle}>
              💡 Helpful Hint
            </Text>

            <Text style={styles.hintText}>
              {hintText}
            </Text>
          </View>
        )}

        {/* ANSWER OPTIONS */}
        <View style={styles.answers}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isRemoved = removedOptions.includes(option);

            // Hides options removed using the Remove button.
            if (isRemoved) {
              return null;
            }

            let buttonStyle = styles.answerButton;
            let textStyle = styles.answerText;

            // Highlights only the user's selected answer.
            if (isSelected && isCorrect) {
              buttonStyle = [
                styles.answerButton,
                styles.correct,
              ];

              textStyle = [
                styles.answerText,
                styles.correctText,
              ];
            } else if (isSelected && !isCorrect) {
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
          <View
            style={[
              styles.feedback,
              isCorrect
                ? styles.correctFeedbackBox
                : styles.wrongFeedbackBox,
            ]}
          >
            <Text
              style={[
                styles.feedbackTitle,
                isCorrect
                  ? styles.correctFeedbackTitle
                  : styles.wrongFeedbackTitle,
              ]}
            >
              {isCorrect ? "✓ Correct!" : "✕ Incorrect!"}
            </Text>

            {/* Shows explanation only when the answer is correct. */}
            {isCorrect && (
              <Text style={styles.feedbackText}>
                {currentQuestion.explanation}
              </Text>
            )}
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

// Styles for the quiz screen.
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

  assistanceContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
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
    opacity: 0.45,
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
