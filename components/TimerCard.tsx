import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, RotateCcw, Trash2 } from 'lucide-react-native';
import { Timer } from '@/types/timer';
import { formatTime, getProgressPercentage } from '@/utils/timer';
import { useThemeContext } from '@/contexts/ThemeContext';
import ProgressBar from './ProgressBar';

interface TimerCardProps {
  timer: Timer;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onDelete: () => void;
}

const TimerCard: React.FC<TimerCardProps> = ({
  timer,
  onStart,
  onPause,
  onReset,
  onDelete,
}) => {
  const { colors } = useThemeContext();
  const progress = getProgressPercentage(timer.remainingTime, timer.duration);

  const getStatusColor = () => {
    switch (timer.status) {
      case 'running':
        return colors.success;
      case 'paused':
        return colors.warning;
      case 'completed':
        return colors.accent;
      default:
        return colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    titleContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    status: {
      fontSize: 12,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    deleteButton: {
      padding: 4,
    },
    timeContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    time: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    duration: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    progressContainer: {
      marginBottom: 16,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
    },
    controlButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      minWidth: 80,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 6,
    },
    primaryButtonText: {
      color: '#FFFFFF',
    },
    secondaryButtonText: {
      color: colors.text,
    },
    halfwayAlert: {
      backgroundColor: colors.warning,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginTop: 8,
    },
    halfwayAlertText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '500',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{timer.name}</Text>
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {timer.status}
          </Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Trash2 size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(timer.remainingTime)}</Text>
        <Text style={styles.duration}>
          of {formatTime(timer.duration)}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} color={getStatusColor()} />
      </View>

      {timer.halfwayAlert && timer.halfwayAlertTriggered && timer.status !== 'completed' && (
        <View style={styles.halfwayAlert}>
          <Text style={styles.halfwayAlertText}>Halfway Alert!</Text>
        </View>
      )}

      <View style={styles.controls}>
        {timer.status === 'running' ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={onPause}
          >
            <Pause size={16} color="#FFFFFF" />
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Pause
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={onStart}
            disabled={timer.status === 'completed'}
          >
            <Play size={16} color="#FFFFFF" />
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Start
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={onReset}
        >
          <RotateCcw size={16} color={colors.text} />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TimerCard;