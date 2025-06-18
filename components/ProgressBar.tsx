import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  height = 6,
}) => {
  const { colors } = useThemeContext();
  const progressColor = color || colors.primary;

  const styles = StyleSheet.create({
    container: {
      height,
      backgroundColor: colors.border,
      borderRadius: height / 2,
      overflow: 'hidden',
    },
    progress: {
      height: '100%',
      backgroundColor: progressColor,
      borderRadius: height / 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.progress, { width: `${Math.min(100, Math.max(0, progress))}%` }]} />
    </View>
  );
};

export default ProgressBar;