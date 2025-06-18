export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const parseTimeInput = (input: string): number => {
  const parts = input.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 1) {
    // Just seconds
    return parts[0] || 0;
  } else if (parts.length === 2) {
    // Minutes:Seconds
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  } else if (parts.length === 3) {
    // Hours:Minutes:Seconds
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  
  return 0;
};

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const getProgressPercentage = (remaining: number, total: number): number => {
  if (total === 0) return 0;
  return Math.max(0, ((total - remaining) / total) * 100);
};

export const getCategoryColors = (): Record<string, string> => {
  return {
    'Workout': '#FF6B6B',
    'Study': '#4ECDC4',
    'Break': '#45B7D1',
    'Work': '#96CEB4',
    'Cooking': '#FFEAA7',
    'Reading': '#DDA0DD',
    'Meditation': '#98D8C8',
    'Other': '#A8A8A8',
  };
};