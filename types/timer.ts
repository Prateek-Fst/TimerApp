export interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
  remainingTime: number;
  category: string;
  status: 'idle' | 'running' | 'paused' | 'completed';
  createdAt: Date;
  halfwayAlert?: boolean;
  halfwayAlertTriggered?: boolean;
}

export interface TimerHistory {
  id: string;
  name: string;
  category: string;
  duration: number;
  completedAt: Date;
}

export interface Category {
  name: string;
  color: string;
  expanded: boolean;
}

export type TimerAction = 
  | { type: 'ADD_TIMER'; payload: Omit<Timer, 'id' | 'createdAt'> }
  | { type: 'START_TIMER'; payload: string }
  | { type: 'PAUSE_TIMER'; payload: string }
  | { type: 'RESET_TIMER'; payload: string }
  | { type: 'COMPLETE_TIMER'; payload: string }
  | { type: 'UPDATE_TIMER'; payload: { id: string; remainingTime: number } }
  | { type: 'DELETE_TIMER'; payload: string }
  | { type: 'START_CATEGORY'; payload: string }
  | { type: 'PAUSE_CATEGORY'; payload: string }
  | { type: 'RESET_CATEGORY'; payload: string }
  | { type: 'LOAD_TIMERS'; payload: Timer[] }
  | { type: 'TRIGGER_HALFWAY_ALERT'; payload: string };