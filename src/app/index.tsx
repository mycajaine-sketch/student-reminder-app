import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/add-reminder')}
      >
        <View style={styles.addButtonContent}>
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="white"
          />

          <Text style={styles.addButtonText}>
            Add Reminder
          </Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={80}
              color="#bdc3c7"
            />

            <Text style={styles.emptyText}>
              No reminders yet
            </Text>

            <Text style={styles.emptySubText}>
              Tap "Add Reminder" to create one
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Ionicons
                name="book-outline"
                size={24}
                color="#3498db"
              />

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
            </View>

            <Text style={styles.description}>
              {item.description}
            </Text>

            <Text style={styles.dueDate}>
              📅 Due Date: {item.dueDate || 'No due date'}
            </Text>

            <Text
              style={[
                styles.status,
                {
                  color: item.completed
                    ? '#27ae60'
                    : '#f39c12',
                },
              ]}
            >
              {item.completed
                ? '✅ Completed'
                : '⏳ Pending'}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() =>
                  toggleCompleted(item.id)
                }
              >
                <Text style={styles.buttonText}>
                  {item.completed
                    ? 'Undo'
                    : 'Complete'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  deleteReminder(item.id)
                }
              >
                <Text style={styles.buttonText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#ecf0f1',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },

  addButton: {
    backgroundColor: '#3498db',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },

  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },

  emptySubText: {
    color: '#95a5a6',
    marginTop: 5,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  description: {
    marginTop: 8,
    fontSize: 15,
    color: '#444',
  },

  dueDate: {
    marginTop: 8,
    color: '#666',
  },

  status: {
    marginTop: 10,
    fontWeight: 'bold',
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },

  completeButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});