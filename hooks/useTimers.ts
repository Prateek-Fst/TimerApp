import { useReducer, useEffect, useRef, useCallback } from 'react';
import { Timer, TimerAction } from '@/types/timer';
import { saveTimers, loadTimers, addToHistory } from '@/utils/storage';
import { generateId } from '@/utils/timer';

const timerReducer = (state: Timer[], action: TimerAction): Timer[] => {
  switch (action.type) {
    case 'ADD_TIMER':
      return [...state, {
        ...action.payload,
        id: generateId(),
        createdAt: new Date(),
      }];

    case 'START_TIMER':
      return state.map(timer =>
        timer.id === action.payload
          ? { ...timer, status: 'running' as const }
          : timer
      );

    case 'PAUSE_TIMER':
      return state.map(timer =>
        timer.id === action.payload
          ? { ...timer, status: 'paused' as const }
          : timer
      );

    case 'RESET_TIMER':
      return state.map(timer =>
        timer.id === action.payload
          ? {
              ...timer,
              remainingTime: timer.duration,
              status: 'idle' as const,
              halfwayAlertTriggered: false,
            }
          : timer
      );

    case 'COMPLETE_TIMER':
      return state.map(timer =>
        timer.id === action.payload
          ? { ...timer, status: 'completed' as const, remainingTime: 0 }
          : timer
      );

    case 'UPDATE_TIMER':
      return state.map(timer =>
        timer.id === action.payload.id
          ? { ...timer, remainingTime: action.payload.remainingTime }
          : timer
      );

    case 'DELETE_TIMER':
      return state.filter(timer => timer.id !== action.payload);

    case 'START_CATEGORY':
      return state.map(timer =>
        timer.category === action.payload && timer.status !== 'completed'
          ? { ...timer, status: 'running' as const }
          : timer
      );

    case 'PAUSE_CATEGORY':
      return state.map(timer =>
        timer.category === action.payload && timer.status === 'running'
          ? { ...timer, status: 'paused' as const }
          : timer
      );

    case 'RESET_CATEGORY':
      return state.map(timer =>
        timer.category === action.payload
          ? {
              ...timer,
              remainingTime: timer.duration,
              status: 'idle' as const,
              halfwayAlertTriggered: false,
            }
          : timer
      );

    case 'LOAD_TIMERS':
      return action.payload;

    case 'TRIGGER_HALFWAY_ALERT':
      return state.map(timer =>
        timer.id === action.payload
          ? { ...timer, halfwayAlertTriggered: true }
          : timer
      );

    default:
      return state;
  }
};

export const useTimers = () => {
  const [timers, dispatch] = useReducer(timerReducer, []);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimerCompleteRef = useRef<(timer: Timer) => void>();

  // Load timers on mount
  useEffect(() => {
    const loadInitialTimers = async () => {
      try {
        const savedTimers = await loadTimers();
        dispatch({ type: 'LOAD_TIMERS', payload: savedTimers });
      } catch (error) {
        console.error('Failed to load timers:', error);
      }
    };
    
    loadInitialTimers();
  }, []);

  // Save timers whenever they change
  useEffect(() => {
    const saveTimersAsync = async () => {
      try {
        await saveTimers(timers);
      } catch (error) {
        console.error('Failed to save timers:', error);
      }
    };

    // Only save if we have timers (avoid saving empty array on initial load)
    if (timers.length > 0) {
      saveTimersAsync();
    }
  }, [timers]);

  // Timer interval management
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const runningTimers = timers.filter(timer => timer.status === 'running');

    if (runningTimers.length > 0) {
      intervalRef.current = setInterval(() => {
        runningTimers.forEach(timer => {
          const newRemainingTime = Math.max(0, timer.remainingTime - 1);
          
          dispatch({
            type: 'UPDATE_TIMER',
            payload: { id: timer.id, remainingTime: newRemainingTime }
          });

          // Check for halfway alert
          if (timer.halfwayAlert && !timer.halfwayAlertTriggered) {
            const halfwayPoint = Math.floor(timer.duration / 2);
            if (timer.remainingTime <= halfwayPoint && newRemainingTime <= halfwayPoint) {
              dispatch({ type: 'TRIGGER_HALFWAY_ALERT', payload: timer.id });
            }
          }

          // Check if timer is completed
          if (newRemainingTime === 0) {
            dispatch({ type: 'COMPLETE_TIMER', payload: timer.id });
            addToHistory(timer);
            onTimerCompleteRef.current?.(timer);
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timers]);

  const setOnTimerComplete = useCallback((callback: (timer: Timer) => void) => {
    onTimerCompleteRef.current = callback;
  }, []);

  return {
    timers,
    dispatch,
    setOnTimerComplete,
  };
};