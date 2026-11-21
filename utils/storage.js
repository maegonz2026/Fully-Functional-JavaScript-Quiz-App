import AsyncStorage from "@react-native-async-storage/async-storage";

// Defines the storage keys used by the application.
export const STORAGE_KEYS = {
  QUIZ_HISTORY: "@javascript_mastery:quiz_history",
};

// Retrieves saved information from AsyncStorage.
export async function getStoredData(key, defaultValue = null) {
  try {
    const storedValue = await AsyncStorage.getItem(key);

    // Returns the default value if no saved data exists.
    if (storedValue === null) {
      return defaultValue;
    }

    // Converts the stored JSON string back into JavaScript data.
    return JSON.parse(storedValue);
  } catch (error) {
    throw new Error(`Failed to retrieve stored data: ${error.message}`);
  }
}

// Saves JavaScript data into AsyncStorage.
export async function saveStoredData(key, value) {
  try {
    // Converts JavaScript data into a JSON string before saving.
    const serializedValue = JSON.stringify(value);

    await AsyncStorage.setItem(key, serializedValue);
  } catch (error) {
    throw new Error(`Failed to save stored data: ${error.message}`);
  }
}

// Removes saved information from AsyncStorage.
export async function removeStoredData(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    throw new Error(`Failed to remove stored data: ${error.message}`);
  }
}
