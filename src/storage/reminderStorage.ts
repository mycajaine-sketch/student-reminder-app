import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'reminders';

export const getReminders = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveReminders = async (reminders: any[]) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(reminders)
    );
  } catch (error) {
    console.log(error);
  }
};