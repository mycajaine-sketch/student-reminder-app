import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

import { router } from 'expo-router';

import {
  getReminders,
  saveReminders,
} from '../storage/reminderStorage';

export default function AddReminderScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(
        'Error',
        'Please enter a title'
      );
      return;
    }

    const reminders = await getReminders();

    const newReminder = {
  id: Date.now().toString(),
  title,
  description,
  dueDate,
  completed: false,
};

    reminders.push(newReminder);

    await saveReminders(reminders);

    Alert.alert('Success', 'Reminder saved!');

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Add Reminder
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Due Date (e.g. June 15, 2026)"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <Button
        title="Save Reminder"
        onPress={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
});