import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timer, TimerHistory } from '@/types/timer';

const TIMERS_KEY = 'timers';
const HISTORY_KEY = 'timer_history';
const CATEGORIES_KEY = 'categories';

export const saveTimers = async (timers: Timer[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TIMERS_KEY, JSON.stringify(timers));
  } catch (error) {
    console.error('Failed to save timers:', error);
  }
};

export const loadTimers = async (): Promise<Timer[]> => {
  try {
    const timersJson = await AsyncStorage.getItem(TIMERS_KEY);
    if (timersJson) {
      return JSON.parse(timersJson).map((timer: any) => ({
        ...timer,
        createdAt: new Date(timer.createdAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to load timers:', error);
    return [];
  }
};

export const saveHistory = async (history: TimerHistory[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

export const loadHistory = async (): Promise<TimerHistory[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    if (historyJson) {
      return JSON.parse(historyJson).map((item: any) => ({
        ...item,
        completedAt: new Date(item.completedAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

export const addToHistory = async (timer: Timer): Promise<void> => {
  try {
    const currentHistory = await loadHistory();
    const historyItem: TimerHistory = {
      id: timer.id,
      name: timer.name,
      category: timer.category,
      duration: timer.duration,
      completedAt: new Date(),
    };
    await saveHistory([historyItem, ...currentHistory]);
  } catch (error) {
    console.error('Failed to add to history:', error);
  }
};

export const exportTimerData = async (): Promise<string> => {
  try {
    const timers = await loadTimers();
    const history = await loadHistory();
    
    const exportData = {
      timers,
      history,
      exportedAt: new Date().toISOString(),
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Failed to export timer data:', error);
    throw error;
  }
};