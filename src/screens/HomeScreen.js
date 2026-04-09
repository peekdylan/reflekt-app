import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { getEntries, deleteEntry } from '../services/api';

// HomeScreen — the main screen showing all of the user's journal entries.
// Entries are fetched every time the screen comes into focus so new entries
// created on the NewEntry screen show up immediately when navigating back.
export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect re-runs whenever this screen becomes active
  // This ensures entries are always fresh when navigating back from NewEntry
  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [])
  );

  const fetchEntries = async () => {
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  // Prompts the user before deleting an entry
  const handleDelete = (id) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(id);
              // Remove the deleted entry from local state without refetching
              setEntries((prev) => prev.filter((e) => e.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  // Renders a single journal entry card in the list
  const renderEntry = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EntryDetail', { entry: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>

      {/* Show mood badge if AI analysis has completed */}
      {item.mood ? (
        <View style={styles.moodBadge}>
          <Text style={styles.moodText}>✦ {item.mood}</Text>
        </View>
      ) : (
        <Text style={styles.analyzingText}>Analyzing...</Text>
      )}

      {/* Tags row */}
      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with greeting and logout button */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name} 👋</Text>
          <Text style={styles.subgreeting}>What's on your mind?</Text>
        </View>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.logout}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Entry list or loading spinner */}
      {loading ? (
        <ActivityIndicator size="large" color="#6c63ff" style={styles.loader} />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderEntry}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No entries yet. Tap + to write your first one!
            </Text>
          }
        />
      )}

      {/* Floating action button to create a new entry */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewEntry')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subgreeting: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  logout: {
    color: '#6c63ff',
    fontSize: 14,
  },
  loader: {
    marginTop: 48,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2e2e2e',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  cardBody: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
    marginBottom: 12,
  },
  moodBadge: {
    backgroundColor: '#2a2040',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  moodText: {
    color: '#6c63ff',
    fontSize: 12,
    fontWeight: '600',
  },
  analyzingText: {
    color: '#555',
    fontSize: 12,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#2e2e2e',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    color: '#888',
    fontSize: 11,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  deleteText: {
    color: '#ff4444',
    fontSize: 12,
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 64,
    fontSize: 16,
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#6c63ff',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#6c63ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
});