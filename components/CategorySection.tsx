import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react-native';
import { Timer } from '@/types/timer';
import { useThemeContext } from '@/contexts/ThemeContext';
import { getCategoryColors } from '@/utils/timer';
import TimerCard from './TimerCard';

interface CategorySectionProps {
  category: string;
  timers: Timer[];
  onStartTimer: (id: string) => void;
  onPauseTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
  onDeleteTimer: (id: string) => void;
  onStartCategory: (category: string) => void;
  onPauseCategory: (category: string) => void;
  onResetCategory: (category: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  timers,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onDeleteTimer,
  onStartCategory,
  onPauseCategory,
  onResetCategory,
}) => {
  const [expanded, setExpanded] = useState(true);
  const { colors } = useThemeContext();
  const categoryColors = getCategoryColors();
  const categoryColor = categoryColors[category] || categoryColors.Other;

  const runningTimers = timers.filter(timer => timer.status === 'running');
  const hasActiveTimers = timers.some(timer => timer.status !== 'completed');

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    header: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: expanded ? 12 : 0,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
    },
    categoryTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    timerCount: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    expandButton: {
      padding: 4,
    },
    bulkControls: {
      flexDirection: 'row',
      gap: 8,
    },
    bulkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    bulkButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.text,
      marginLeft: 4,
    },
    timersContainer: {
      paddingLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.titleContainer}
            onPress={() => setExpanded(!expanded)}
          >
            <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
            <Text style={styles.categoryTitle}>{category}</Text>
            <Text style={styles.timerCount}>({timers.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronDown size={20} color={colors.textSecondary} />
            ) : (
              <ChevronRight size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        {expanded && hasActiveTimers && (
          <View style={styles.bulkControls}>
            <TouchableOpacity
              style={styles.bulkButton}
              onPress={() => onStartCategory(category)}
            >
              <Play size={12} color={colors.text} />
              <Text style={styles.bulkButtonText}>Start All</Text>
            </TouchableOpacity>

            {runningTimers.length > 0 && (
              <TouchableOpacity
                style={styles.bulkButton}
                onPress={() => onPauseCategory(category)}
              >
                <Pause size={12} color={colors.text} />
                <Text style={styles.bulkButtonText}>Pause All</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.bulkButton}
              onPress={() => onResetCategory(category)}
            >
              <RotateCcw size={12} color={colors.text} />
              <Text style={styles.bulkButtonText}>Reset All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {expanded && (
        <View style={styles.timersContainer}>
          {timers.map(timer => (
            <TimerCard
              key={timer.id}
              timer={timer}
              onStart={() => onStartTimer(timer.id)}
              onPause={() => onPauseTimer(timer.id)}
              onReset={() => onResetTimer(timer.id)}
              onDelete={() => onDeleteTimer(timer.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CategorySection;