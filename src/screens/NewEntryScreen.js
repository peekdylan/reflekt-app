import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { createEntry } from '../services/api';

// NewEntryScreen — lets the user write and submit a new journal entry.
// After submitting, the entry is saved and AI analysis begins in the background.
export default function NewEntryScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !body) {
      Alert.alert('Error', 'Please add a title and write something');
      return;
    }

    // Convert the comma-separated tags string into a clean array
    // e.g. "coding, proud, happy" → ["coding", "proud", "happy"]
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setLoading(true);
    try {
      await createEntry(title, body, tags);

      // Navigate back to the home screen after saving
      // The home screen will automatically reload and show the new entry
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Entry</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#6c63ff" />
            ) : (
              <Text style={styles.save}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Title input */}
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor="#555"
          value={title}
          onChangeText={setTitle}
        />

        {/* Body input — large multiline text area */}
        <TextInput
          style={styles.bodyInput}
          placeholder="What's on your mind today?"
          placeholderTextColor="#555"
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
        />

        {/* Tags input — comma separated */}
        <TextInput
          style={styles.tagsInput}
          placeholder="Tags (comma separated, e.g. happy, work, coding)"
          placeholderTextColor="#555"
          value={tagsInput}
          onChangeText={setTagsInput}
        />

        {/* Hint about AI analysis */}
        <Text style={styles.aiHint}>
          ✦ Claude AI will analyze your entry and detect your mood automatically
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancel: {
    color: '#888',
    fontSize: 16,
  },
  save: {
    color: '#6c63ff',
    fontSize: 16,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2e2e2e',
    paddingBottom: 12,
  },
  bodyInput: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 26,
    minHeight: 300,
    marginBottom: 24,
  },
  tagsInput: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2e2e2e',
    marginBottom: 16,
  },
  aiHint: {
    color: '#6c63ff',
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
});