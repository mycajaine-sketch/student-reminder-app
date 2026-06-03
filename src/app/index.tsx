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
      <View style={styles.header}>
        <Text style={styles.title}>
          Student Reminder App
        </Text>

        <Text style={styles.subtitle}>
          Organize your school tasks and deadlines
        </Text>

        <Text style={styles.counterText}>
          Total Reminders: {reminders.length}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/add-reminder')}
      >
        <View style={styles.addButtonContent}>
          <Ionicons
            name="add-circle-outline"
            size={22}
            color="#fff"
          />
          <Text style={styles.addButtonText}>
            Add Reminder
          </Text>
        </View>
      </TouchableOpacity>

      {reminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="clipboard-outline"
            size={80}
            color="#bdc3c7"
          />

          <Text style={styles.emptyText}>
            No Reminders Yet
          </Text>

          <Text style={styles.emptySubText}>
            Tap "Add Reminder" to create your
            first task.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
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
                      textDecorationLine:
                        'line-through',
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
                📅 Due Date:{' '}
                {item.dueDate || 'No due date'}
              </Text>

              <Text
                style={[
                  styles.status,
                  {
                    backgroundColor:
                      item.completed
                        ? '#d4edda'
                        : '#fff3cd',
                    color: item.completed
                      ? '#155724'
                      : '#856404',
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  subtitle: {
    color: '#ecf0f1',
    marginTop: 5,
    fontSize: 15,
  },

  counterText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },

  addButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },

  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },

  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 15,
  },

  emptySubText: {
    color: '#95a5a6',
    marginTop: 5,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    elevation: 5,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },

  description: {
    marginTop: 10,
    color: '#555',
    fontSize: 15,
    lineHeight: 22,
  },

  dueDate: {
    marginTop: 10,
    color: '#34495e',
    fontWeight: '500',
  },

  status: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
    fontWeight: 'bold',
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
  },

  completeButton: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },

  deleteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});