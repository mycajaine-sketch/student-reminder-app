import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';

import {
  getReminders,
  saveReminders,
} from '../storage/reminderStorage';

export default function HomeScreen() {
  const [reminders, setReminders] = useState<any[]>([]);

  const loadData = async () => {
    const data = await getReminders();
    setReminders(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const deleteReminder = async (id: string) => {
    const updated = reminders.filter(
      (item) => item.id !== id
    );

    setReminders(updated);
    await saveReminders(updated);
  };

  const toggleCompleted = async (id: string) => {
    const updated = reminders.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          completed: !item.completed,
        };
      }

      return item;
    });

    setReminders(updated);
    await saveReminders(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Student Reminder App
      </Text>

      <Button
        title="Add Reminder"
        onPress={() => router.push('/add-reminder')}
      />

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text
              style={[
                styles.cardTitle,
                item.completed && {
                  textDecorationLine: 'line-through',
                  color: 'gray',
                },
              ]}
            >
              {item.title}
            </Text>

            <Text>{item.description}</Text>

            <Text style={styles.dueDate}>
              Due Date: {item.dueDate || 'No due date'}
            </Text>

            <Text
              style={[
                styles.status,
                {
                  color: item.completed
                    ? 'green'
                    : 'orange',
                },
              ]}
            >
              Status:{' '}
              {item.completed
                ? 'Completed ✅'
                : 'Pending ⏳'}
            </Text>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={() =>
                toggleCompleted(item.id)
              }
            >
              <Text style={styles.completeText}>
                {item.completed
                  ? 'Mark as Pending'
                  : 'Mark as Completed'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                deleteReminder(item.id)
              }
            >
              <Text style={styles.deleteText}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginTop: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  dueDate: {
    marginTop: 5,
    color: '#555',
  },

  status: {
    marginTop: 8,
    fontWeight: 'bold',
  },

  completeButton: {
    marginTop: 10,
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },

  completeText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  deleteButton: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },

  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});