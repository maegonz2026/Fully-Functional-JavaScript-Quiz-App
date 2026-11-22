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
  },
  Medium: {
    start: 71,
    end: 140,
  },
  Hard: {
    start: 141,
    end: 200,
  },
  Expert: {
    start: 201,
    end: 250,
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
    let availableQuestions = [];
    let questionCount = 10;

    // Level-based quiz.
    if (level !== null && difficulty !== null) {
      const range = QUESTION_RANGES[difficulty];

      // Validate the selected difficulty.
      if (!range) {
        console.error("Invalid quiz difficulty:", difficulty);
        setQuizQuestions([]);
        return;
      }

      // Validate the selected level.
      const validDifficulty =
        (difficulty === "Easy" && level >= 1 && level <= 20) ||
        (difficulty === "Medium" && level >= 21 && level <= 35) ||
        (difficulty === "Hard" && level >= 36 && level <= 45) ||
        (difficulty === "Expert" && level >= 46 && level <= 50);

      if (!validDifficulty) {
        console.error("Invalid level for difficulty:", level, difficulty);
        setQuizQuestions([]);
        return;
      }

      // Convert string question IDs into numbers for comparison.
      availableQuestions = questions.filter((question) => {
        const questionId = Number(question.id);

        return (
          questionId >= range.start &&
          questionId <= range.end
        );
      });

      // Get the required number of questions for this level.
      questionCount = getLevelQuestionCount(level);

      // Store the selected level information.
      setCurrentLevel(level);
      setCurrentDifficulty(difficulty);
    }

    // Daily or general quiz using the entire question bank.
    else {
      availableQuestions = questions;
      questionCount = 10;

      setCurrentLevel(null);
      setCurrentDifficulty(null);
    }

    // Randomly select questions without duplicates in this attempt.
    const randomizedQuestions = shuffle(availableQuestions).slice(
      0,
      questionCount
    );

    // Prevent starting an incomplete quiz if the question bank is insufficient.
    if (randomizedQuestions.length !== questionCount) {
      console.error(
        `Expected ${questionCount} questions, but only found ${randomizedQuestions.length}.`
      );

      setQuizQuestions([]);
      return;
    }

    // Reset the previous quiz state.
    setQuizQuestions(randomizedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
  }, []);

  // Checks and stores the selected answer.
  const selectAnswer = useCallback((answer) => {
    // Prevents selecting multiple answers for one question.
    if (selectedAnswer !== null) {
      return;
    }

    const currentQuestion = quizQuestions[currentIndex];

    // Prevents accessing an unavailable question.
    if (!currentQuestion) {
      return;
    }

    // Saves the selected answer.
    setSelectedAnswer(answer);

    // Updates the score if the answer is correct.
    if (answer === currentQuestion.answer) {
      setScore((previous) => previous + 1);
    }
  }, [selectedAnswer, quizQuestions, currentIndex]);

  // Moves to the next question or returns the final result.
  const nextQuestion = useCallback(() => {
    // Requires an answer before allowing the user to continue.
    if (selectedAnswer === null) {
      return null;
    }

    const currentQuestion = quizQuestions[currentIndex];

    // Prevents accessing an unavailable question.
    if (!currentQuestion) {
      return null;
    }

    // Checks whether the current question is the last one.
    if (currentIndex === quizQuestions.length - 1) {
      // Calculates the final score.
      const finalScore = score;

      return {
        finished: true,
        score: finalScore,
        total: quizQuestions.length,
        percentage: Math.round(
          (finalScore / quizQuestions.length) * 100
        ),
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
