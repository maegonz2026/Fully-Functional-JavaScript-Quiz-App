import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

// Imports the complete 250-question JavaScript question bank.
import questions from "../data/questions";

// Creates the context used to share quiz state.
const QuizContext = createContext(null);

// Defines the question ID ranges for each difficulty.
const QUESTION_RANGES = {
  Easy: {
    start: 1,
    end: 70,
    minLevel: 1,
    maxLevel: 20,
  },
  Medium: {
    start: 71,
    end: 140,
    minLevel: 21,
    maxLevel: 35,
  },
  Hard: {
    start: 141,
    end: 200,
    minLevel: 36,
    maxLevel: 45,
  },
  Expert: {
    start: 201,
    end: 250,
    minLevel: 46,
    maxLevel: 50,
  },
};

// Determines the number of questions assigned to a level.
function getLevelQuestionCount(level) {
  if (level >= 1 && level <= 10) return 3;
  if (level >= 11 && level <= 25) return 4;
  if (level >= 26 && level <= 35) return 5;
  if (level >= 36 && level <= 45) return 6;
  if (level >= 46 && level <= 50) return 10;

  return 0;
}

// Randomizes an array without modifying the original data.
function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// Clears the current quiz state.
function resetQuizState(setters) {
  setters.setQuizQuestions([]);
  setters.setCurrentIndex(0);
  setters.setScore(0);
  setters.setSelectedAnswer(null);
  setters.setCurrentLevel(null);
  setters.setCurrentDifficulty(null);
}

// Provides shared quiz data and functions to the application.
export function QuizProvider({ children }) {
  // Stores the questions selected for the current quiz.
  const [quizQuestions, setQuizQuestions] = useState([]);

  // Tracks the current question position.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Stores the user's current score.
  const [score, setScore] = useState(0);

  // Stores the answer selected by the user.
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Stores the current level and difficulty.
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentDifficulty, setCurrentDifficulty] = useState(null);

  // Starts a new quiz using the selected level and difficulty.
  const startQuiz = useCallback((level = null, difficulty = null) => {
    // Validates that both level and difficulty are provided together.
    const hasLevel = level !== null && level !== undefined;
    const hasDifficulty =
      difficulty !== null && difficulty !== undefined;

    const setters = {
      setQuizQuestions,
      setCurrentIndex,
      setScore,
      setSelectedAnswer,
      setCurrentLevel,
      setCurrentDifficulty,
    };

    if (hasLevel !== hasDifficulty) {
      console.error(
        "Both level and difficulty must be provided together."
      );

      resetQuizState(setters);
      return false;
    }

    let availableQuestions = [];
    let questionCount = 10;

    // Level-based quiz.
    if (hasLevel && hasDifficulty) {
      const numericLevel = Number(level);
      const range = QUESTION_RANGES[difficulty];

      // Validates the selected difficulty.
      if (!range) {
        console.error("Invalid quiz difficulty:", difficulty);

        resetQuizState(setters);
        return false;
      }

      // Validates the level number.
      if (
        !Number.isInteger(numericLevel) ||
        numericLevel < 1 ||
        numericLevel > 50
      ) {
        console.error("Invalid quiz level:", level);

        resetQuizState(setters);
        return false;
      }

      // Checks whether the level belongs to the selected difficulty.
      const validDifficulty =
        numericLevel >= range.minLevel &&
        numericLevel <= range.maxLevel;

      if (!validDifficulty) {
        console.error(
          "Invalid level for difficulty:",
          numericLevel,
          difficulty
        );

        resetQuizState(setters);
        return false;
      }

      // Selects questions belonging to the chosen difficulty.
      availableQuestions = questions.filter((question) => {
        const questionId = Number(question.id);

        return (
          Number.isInteger(questionId) &&
          questionId >= range.start &&
          questionId <= range.end
        );
      });

      // Gets the required number of questions.
      questionCount = getLevelQuestionCount(numericLevel);

      // Validates the question count.
      if (questionCount <= 0) {
        console.error("Invalid question count for level:", numericLevel);

        resetQuizState(setters);
        return false;
      }

      // Stores the selected level information.
      setCurrentLevel(numericLevel);
      setCurrentDifficulty(difficulty);
    }

    // Daily or general quiz using the entire question bank.
    else {
      availableQuestions = questions;
      questionCount = 10;

      setCurrentLevel(null);
      setCurrentDifficulty(null);
    }

    // Checks whether enough questions are available.
    if (
      !Array.isArray(availableQuestions) ||
      availableQuestions.length < questionCount
    ) {
      console.error(
        `Not enough questions. Required: ${questionCount}, Available: ${
          availableQuestions.length
        }.`
      );

      resetQuizState(setters);
      return false;
    }

    // Randomly selects questions without duplicates.
    const randomizedQuestions = shuffle(availableQuestions).slice(
      0,
      questionCount
    );

    // Resets the previous quiz state.
    setQuizQuestions(randomizedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);

    return true;
  }, []);

  // Checks and stores the selected answer.
  const selectAnswer = useCallback(
    (answer) => {
      // Prevents selecting multiple answers.
      if (selectedAnswer !== null) {
        return false;
      }

      const currentQuestion = quizQuestions[currentIndex];

      // Prevents invalid question access.
      if (!currentQuestion) {
        return false;
      }

      // Validates the selected answer.
      if (
        typeof answer !== "string" ||
        !currentQuestion.options.includes(answer)
      ) {
        return false;
      }

      // Saves the selected answer.
      setSelectedAnswer(answer);

      // Updates the score if the answer is correct.
      if (answer === currentQuestion.answer) {
        setScore((previous) => previous + 1);
      }

      return true;
    },
    [selectedAnswer, quizQuestions, currentIndex]
  );

  // Moves to the next question or returns the final result.
  const nextQuestion = useCallback(() => {
    // Requires an answer before continuing.
    if (selectedAnswer === null) {
      return null;
    }

    const currentQuestion = quizQuestions[currentIndex];

    // Prevents accessing an unavailable question.
    if (!currentQuestion) {
      return null;
    }

    // Checks whether this is the last question.
    if (currentIndex === quizQuestions.length - 1) {
      const finalScore = score;
      const total = quizQuestions.length;

      // Calculates the final percentage safely.
      const percentage =
        total > 0
          ? Math.round((finalScore / total) * 100)
          : 0;

      return {
        finished: true,
        score: finalScore,
        total,
        percentage,
        level: currentLevel,
        difficulty: currentDifficulty,
      };
    }

    // Advances to the next question.
    setCurrentIndex((previous) => previous + 1);

    // Clears the previous answer selection.
    setSelectedAnswer(null);

    return {
      finished: false,
    };
  }, [
    selectedAnswer,
    quizQuestions,
    currentIndex,
    score,
    currentLevel,
    currentDifficulty,
  ]);

  // Shares quiz data and functions with child components.
  const value = {
    quizQuestions,
    currentIndex,
    score,
    selectedAnswer,
    currentLevel,
    currentDifficulty,
    startQuiz,
    selectAnswer,
    nextQuestion,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

// Custom hook for accessing the shared quiz context.
export function useQuiz() {
  const context = useContext(QuizContext);

  // Prevents using the hook outside its provider.
  if (!context) {
    throw new Error("useQuiz must be used inside QuizProvider.");
  }

  return context;
}
