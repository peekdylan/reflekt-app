import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// EntryDetailScreen — shows the full content of a journal entry
// including the AI-generated mood and analysis.
// The entry data is passed via navigation params from the HomeScreen.
export default function EntryDetailScreen({ route, navigation }) {
  // Extract the entry from navigation params
  const { entry } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* Back button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Entry date */}
      <Text style={styles.date}>
        {new Date(entry.created_at).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>

      {/* Entry title */}
      <Text style={styles.title}>{entry.title}</Text>

      {/* AI mood badge — only shown if analysis is complete */}
      {entry.mood ? (
        <View style={styles.moodBadge}>
          <Text style={styles.moodLabel}>MOOD</Text>
          <Text style={styles.moodText}>{entry.mood}</Text>
        </View>
      ) : (
        <View style={styles.analyzingBadge}>
          <Text style={styles.analyzingText}>✦ AI is analyzing your entry...</Text>
        </View>
      )}

      {/* Entry body */}
      <Text style={styles.body}>{entry.body}</Text>

      {/* AI analysis section — only shown if analysis is complete */}
      {entry.ai_analysis ? (
        <View style={styles.analysisCard}>
          <Text style={styles.analysisLabel}>✦ AI Insight</Text>
          <Text style={styles.analysisText}>{entry.ai_analysis}</Text>
        </View>
      ) : null}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {entry.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  inner: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    color: '#6c63ff',
    fontSize: 16,
  },
  date: {
    color: '#666',
    fontSize: 13,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    lineHeight: 36,
  },
  moodBadge: {
    backgroundColor: '#2a2040',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3d3060',
  },
  moodLabel: {
    color: '#6c63ff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  moodText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  analyzingBadge: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  analyzingText: {
    color: '#555',
    fontSize: 14,
    fontStyle: 'italic',
  },
  body: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 28,
    marginBottom: 32,
  },
  analysisCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2040',
  },
  analysisLabel: {
    color: '#6c63ff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  analysisText: {
    color: '#bbb',
    fontSize: 15,
    lineHeight: 26,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#2e2e2e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: '#888',
    fontSize: 13,
  },
});