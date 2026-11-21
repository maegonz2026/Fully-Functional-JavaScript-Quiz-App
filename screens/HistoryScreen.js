
import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

// Imports the AsyncStorage utility functions.
import {
  getStoredData,
  STORAGE_KEYS,
} from "../utils/storage";

export default function HistoryScreen({ navigation }) {

  // Stores the saved quiz history.
  const [quizHistory, setQuizHistory] = useState([]);

  // Tracks whether the history is being loaded.
  const [loading, setLoading] = useState(true);

  // Stores an error message if loading fails.
  const [error, setError] = useState("");

  // Loads saved quiz results whenever this screen becomes active.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadHistory() {
        try {
          setLoading(true);
          setError("");

          // Retrieves previously saved quiz results.
          const savedHistory = await getStoredData(
            STORAGE_KEYS.QUIZ_HISTORY,
            []
          );

          if (isActive) {
            const validHistory = Array.isArray(savedHistory)
              ? savedHistory
              : [];

            // Sorts results from newest to oldest.
            setQuizHistory(
              [...validHistory].sort(
                (a, b) =>
                  new Date(b.completedAt) - new Date(a.completedAt)
              )
            );
          }
        } catch (err) {
          if (isActive) {
            setError("Unable to load quiz history. Please try again.");
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      loadHistory();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Calculates the total number of completed quizzes.
  const totalQuizzes = quizHistory.length;

  // Calculates the highest percentage achieved.
  const highestScore = totalQuizzes > 0
    ? Math.max(...quizHistory.map((item) => item.percentage || 0))
    : 0;

  // Calculates the average percentage across all attempts.
  const averageScore = totalQuizzes > 0
    ? Math.round(
        quizHistory.reduce(
          (sum, item) => sum + (item.percentage || 0),
          0
        ) / totalQuizzes
      )
    : 0;

  // Formats the saved completion date and time.
  function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleString();
  }

  // Returns a color based on the quiz percentage.
  function getScoreColor(percentage) {
    if (percentage >= 80) {
      return "#16a34a";
    }

    if (percentage >= 60) {
      return "#2563eb";
    }

    return "#dc2626";
  }

  return (
    // Excludes the top safe area because the native navigation header handles it.
    <SafeAreaView
      style={styles.container}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* STATISTICS: Displays overall quiz performance. */}
        {!loading && !error && (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {totalQuizzes}
                </Text>

                <Text style={styles.statLabel}>
                  Total Quizzes
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {highestScore}%
                </Text>

                <Text style={styles.statLabel}>
                  Highest Score
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {averageScore}%
                </Text>

                <Text style={styles.statLabel}>
                  Average Score
                </Text>
              </View>
            </View>

            {/* HISTORY LIST: Displays all saved quiz attempts. */}
            <Text style={styles.sectionTitle}>
              Previous Attempts
            </Text>
          </>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />

            <Text style={styles.loadingText}>
              Loading quiz history...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              Unable to Load History
            </Text>

            <Text style={styles.emptyText}>
              {error}
            </Text>
          </View>
        ) : quizHistory.length === 0 ? (
          // Displays an empty state when no quiz results exist.
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📚</Text>

            <Text style={styles.emptyTitle}>
              No Quiz History Yet
            </Text>

            <Text style={styles.emptyText}>
              Complete your first JavaScript quiz to see your results here.
            </Text>
          </View>
        ) : (
          quizHistory.map((item, index) => (
            <View
              key={item.id || index.toString()}
              style={styles.historyCard}
            >
              <View style={styles.historyTop}>
                <View style={styles.attemptInfo}>
                  <Text style={styles.attemptTitle}>
                    Quiz Attempt {totalQuizzes - index}
                  </Text>

                  <Text style={styles.date}>
                    {formatDate(item.completedAt)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.percentage,
                    {
                      color: getScoreColor(item.percentage || 0),
                    },
                  ]}
                >
                  {item.percentage || 0}%
                </Text>
              </View>

              <View style={styles.historyDivider} />

              <View style={styles.historyBottom}>
                <Text style={styles.scoreText}>
                  Score: {item.score}/{item.total}
                </Text>

                <Text
                  style={[
                    styles.resultLabel,
                    {
                      color: getScoreColor(item.percentage || 0),
                    },
                  ]}
                >
                  {(item.percentage || 0) >= 80
                    ? "Excellent"
                    : (item.percentage || 0) >= 60
                    ? "Good Job"
                    : "Keep Practicing"}
                </Text>
              </View>
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// STYLES: Controls the history layout and appearance.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  scrollContent: {
    padding: 20,
    paddingTop: 18,
    paddingBottom: 30,
    flexGrow: 1,
  },

  loadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },

  loadingText: {
    color: "#64748b",
    fontSize: 15,
    marginTop: 15,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  statValue: {
    fontSize: 23,
    fontWeight: "900",
    color: "#2563eb",
  },

  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textAlign: "center",
    marginTop: 7,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#172554",
    marginBottom: 15,
  },

  historyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  historyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  attemptInfo: {
    flex: 1,
    paddingRight: 10,
  },

  attemptTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#172554",
  },

  date: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 6,
  },

  percentage: {
    fontSize: 25,
    fontWeight: "900",
  },

  historyDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 15,
  },

  historyBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scoreText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  resultLabel: {
    fontSize: 13,
    fontWeight: "800",
  },

  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 5,
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#172554",
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
  },
});
