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

import {
  getStoredData,
  STORAGE_KEYS,
} from "../utils/storage";

export default function PerformanceScreen() {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load saved performance records whenever the screen is opened.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadPerformance() {
        try {
          setLoading(true);
          setError("");

          const savedHistory = await getStoredData(
            STORAGE_KEYS.QUIZ_HISTORY,
            []
          );

          if (isActive) {
            const validHistory = Array.isArray(savedHistory)
              ? savedHistory
              : [];

            setQuizHistory(
              [...validHistory].sort(
                (a, b) =>
                  new Date(b.completedAt) - new Date(a.completedAt)
              )
            );
          }
        } catch (err) {
          if (isActive) {
            setError(
              "Unable to load your performance. Please try again."
            );
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      loadPerformance();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // Calculate overall performance statistics.
  const totalQuizzes = quizHistory.length;

  const highestScore =
    totalQuizzes > 0
      ? Math.max(
          ...quizHistory.map((item) => Number(item.percentage) || 0)
        )
      : 0;

  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          quizHistory.reduce(
            (sum, item) => sum + (Number(item.percentage) || 0),
            0
          ) / totalQuizzes
        )
      : 0;

  // Calculate the number of passing attempts.
  const passedQuizzes = quizHistory.filter(
    (item) => (Number(item.percentage) || 0) >= 65
  ).length;

  // Format saved completion dates.
  function formatDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleString();
  }

  // Determine the score color.
  function getScoreColor(percentage) {
    if (percentage >= 80) return "#16A34A";
    if (percentage >= 65) return "#2563EB";
    return "#DC2626";
  }

  // Determine the performance label.
  function getPerformanceLabel(percentage) {
    if (percentage >= 90) return "Outstanding";
    if (percentage >= 80) return "Excellent";
    if (percentage >= 65) return "Passed";
    return "Keep Practicing";
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Performance introduction */}
        {!loading && !error && (
          <>
            <View style={styles.introContainer}>
              <Text style={styles.title}>
                Your Performance
              </Text>

              <Text style={styles.subtitle}>
                Track your quiz results and monitor your JavaScript
                learning progress.
              </Text>
            </View>

            {/* Overall statistics */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {totalQuizzes}
                </Text>

                <Text style={styles.statLabel}>
                  Total Attempts
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {highestScore}%
                </Text>

                <Text style={styles.statLabel}>
                  Best Score
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {averageScore}%
                </Text>

                <Text style={styles.statLabel}>
                  Average
                </Text>
              </View>
            </View>

            {/* Passing statistics */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryIconContainer}>
                <Text style={styles.summaryIcon}>🏆</Text>
              </View>

              <View style={styles.summaryInfo}>
                <Text style={styles.summaryTitle}>
                  Passing Attempts
                </Text>

                <Text style={styles.summaryDescription}>
                  {passedQuizzes} out of {totalQuizzes} quiz attempts
                  passed the 65% requirement.
                </Text>
              </View>

              <Text style={styles.summaryValue}>
                {totalQuizzes > 0
                  ? Math.round((passedQuizzes / totalQuizzes) * 100)
                  : 0}%
              </Text>
            </View>

            {/* Previous results */}
            <Text style={styles.sectionTitle}>
              Recent Performance
            </Text>

            <Text style={styles.sectionSubtitle}>
              Review your previous quiz attempts.
            </Text>
          </>
        )}

        {/* Loading state */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />

            <Text style={styles.loadingText}>
              Loading performance...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              Unable to Load Performance
            </Text>

            <Text style={styles.emptyText}>
              {error}
            </Text>
          </View>
        ) : quizHistory.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📊</Text>

            <Text style={styles.emptyTitle}>
              No Performance Data Yet
            </Text>

            <Text style={styles.emptyText}>
              Complete your first JavaScript quiz to see your
              scores and learning progress here.
            </Text>
          </View>
        ) : (
          quizHistory.map((item, index) => {
            const percentage = Number(item.percentage) || 0;

            return (
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
                      { color: getScoreColor(percentage) },
                    ]}
                  >
                    {percentage}%
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
                      { color: getScoreColor(percentage) },
                    ]}
                  >
                    {getPerformanceLabel(percentage)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
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
    paddingTop: 18,
    paddingBottom: 30,
    flexGrow: 1,
  },

  introContainer: {
    marginBottom: 22,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#172554",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
    marginTop: 7,
  },

  loadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },

  loadingText: {
    color: "#64748B",
    fontSize: 15,
    marginTop: 15,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statValue: {
    fontSize: 23,
    fontWeight: "900",
    color: "#2563EB",
  },

  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
    marginTop: 7,
  },

  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 27,
  },

  summaryIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  summaryIcon: {
    fontSize: 23,
  },

  summaryInfo: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#172554",
  },

  summaryDescription: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 17,
    marginTop: 4,
  },

  summaryValue: {
    fontSize: 19,
    fontWeight: "900",
    color: "#16A34A",
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#172554",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
    marginBottom: 15,
  },

  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    color: "#94A3B8",
    marginTop: 6,
  },

  percentage: {
    fontSize: 25,
    fontWeight: "900",
  },

  historyDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
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
    fontSize: 12,
    fontWeight: "800",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
  },
});
