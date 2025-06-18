import React, { createContext, useContext, ReactNode } from 'react';
import { Timer, TimerAction } from '@/types/timer';
import { useTimers } from '@/hooks/useTimers';

interface TimerContextType {
  timers: Timer[];
  dispatch: React.Dispatch<TimerAction>;
  setOnTimerComplete: (callback: (timer: Timer) => void) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const timerState = useTimers();

  return (
    <TimerContext.Provider value={timerState}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};