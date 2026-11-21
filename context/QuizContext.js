import React, {
  createContext,
  useContext,
  useState,
} from "react";

// Imports the existing JavaScript question collection.
import questions from "../data/questions";

// Creates the context used to share quiz state.
const QuizContext = createContext(null);

// Randomizes the question order without modifying the original array.
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

  // Stores the 10 questions selected for the current quiz.
  const [quizQuestions, setQuizQuestions] = useState([]);

  // Tracks the current question position.
  const [currentIndex, setCurrentIndex] = useState(0);

  // Stores the user's current quiz score.
  const [score, setScore] = useState(0);

  // Stores the answer selected by the user.
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Starts a new quiz and resets all previous quiz data.
  function startQuiz() {
    const randomizedQuestions = shuffle(questions).slice(0, 10);

    setQuizQuestions(randomizedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
  }

  // Checks and stores the selected answer.
  function selectAnswer(answer) {

    // Prevents selecting multiple answers for one question.
    if (selectedAnswer !== null) {
      return;
    }

    const currentQuestion = quizQuestions[currentIndex];

    // Saves the selected answer.
    setSelectedAnswer(answer);

    // Updates the score if the answer is correct.
    if (answer === currentQuestion.answer) {
      setScore((previous) => previous + 1);
    }
  }

  // Moves to the next question or prepares the final result.
  function nextQuestion() {

    // Requires an answer before allowing the user to continue.
    if (selectedAnswer === null) {
      return null;
    }

    const currentQuestion = quizQuestions[currentIndex];

    // Checks whether the current question is the last one.
    if (currentIndex === quizQuestions.length - 1) {

      // Calculates the final score, including the current answer.
      const finalScore =
        score +
        (selectedAnswer === currentQuestion.answer ? 1 : 0);

      return {
        finished: true,
        score: finalScore,
        total: quizQuestions.length,
      };
    }

    // Advances to the next question.
    setCurrentIndex((previous) => previous + 1);

    // Clears the previous answer selection.
    setSelectedAnswer(null);

    return {
      finished: false,
    };
  }

  // Shares quiz data and functions with child components.
  const value = {
    quizQuestions,
    currentIndex,
    score,
    selectedAnswer,
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
