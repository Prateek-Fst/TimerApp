import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { CircleCheck as CheckCircle, X } from 'lucide-react-native';
import { Timer } from '@/types/timer';
import { useThemeContext } from '@/contexts/ThemeContext';
import { formatTime } from '@/utils/timer';

interface CompletionModalProps {
  visible: boolean;
  timer: Timer | null;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
  visible,
  timer,
  onClose,
}) => {
  const { colors } = useThemeContext();

  if (!timer) return null;

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modal: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 320,
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      padding: 4,
    },
    icon: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    timerName: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    duration: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 8,
      width: '100%',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.icon}>
            <CheckCircle size={64} color={colors.success} />
          </View>

          <Text style={styles.title}>Timer Complete!</Text>
          <Text style={styles.subtitle}>Congratulations! You've completed:</Text>

          <Text style={styles.timerName}>{timer.name}</Text>
          <Text style={styles.duration}>
            Duration: {formatTime(timer.duration)}
          </Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Awesome!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CompletionModal;