import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTimerContext } from '@/contexts/TimerContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import { parseTimeInput, getCategoryColors } from '@/utils/timer';

const predefinedCategories = ['Workout', 'Study', 'Break', 'Work', 'Cooking', 'Reading', 'Meditation', 'Other'];

export default function AddTimerScreen() {
  const { dispatch } = useTimerContext();
  const { colors } = useThemeContext();
  const [name, setName] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Workout');
  const [customCategory, setCustomCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const categoryColors = getCategoryColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
    },
    scrollView: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
    timeInputContainer: {
      marginBottom: 8,
    },
    timeHint: {
      fontSize: 12,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      minWidth: 80,
    },
    selectedCategoryButton: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    categoryIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    selectedCategoryButtonText: {
      color: '#FFFFFF',
    },
    customCategoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    customCategoryText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 8,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    switchLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      flex: 1,
    },
    switchDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    buttonContainer: {
      gap: 12,
      paddingTop: 20,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: colors.border,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    buttonTextDisabled: {
      color: colors.textSecondary,
    },
    cancelButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      color: colors.text,
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a timer name');
      return;
    }

    if (!timeInput.trim()) {
      Alert.alert('Error', 'Please enter a timer duration');
      return;
    }

    const duration = parseTimeInput(timeInput);
    if (duration <= 0) {
      Alert.alert('Error', 'Please enter a valid timer duration');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : selectedCategory;
    if (!finalCategory) {
      Alert.alert('Error', 'Please select or enter a category');
      return;
    }

    dispatch({
      type: 'ADD_TIMER',
      payload: {
        name: name.trim(),
        duration,
        remainingTime: duration,
        category: finalCategory,
        status: 'idle',
        halfwayAlert,
        halfwayAlertTriggered: false,
      },
    });

    // Reset form
    setName('');
    setTimeInput('');
    setSelectedCategory('Workout');
    setCustomCategory('');
    setHalfwayAlert(false);
    setIsCustomCategory(false);

    // Navigate back to timers
    router.push('/(tabs)/');
  };

  const isFormValid = name.trim() && timeInput.trim() && (isCustomCategory ? customCategory.trim() : selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Timer</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Timer Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Workout Timer"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g., 300 or 5:00 or 1:30:00"
              placeholderTextColor={colors.textSecondary}
              value={timeInput}
              onChangeText={setTimeInput}
            />
          </View>
          <Text style={styles.timeHint}>
            Enter seconds (300), minutes:seconds (5:00), or hours:minutes:seconds (1:30:00)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {predefinedCategories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  !isCustomCategory && selectedCategory === category && styles.selectedCategoryButton,
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  setIsCustomCategory(false);
                }}
              >
                <View
                  style={[
                    styles.categoryIndicator,
                    { backgroundColor: categoryColors[category] || categoryColors.Other },
                  ]}
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    !isCustomCategory && selectedCategory === category && styles.selectedCategoryButtonText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customCategoryContainer}>
            <Switch
              value={isCustomCategory}
              onValueChange={setIsCustomCategory}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
            <Text style={styles.customCategoryText}>Use custom category</Text>
          </View>

          {isCustomCategory && (
            <TextInput
              style={styles.input}
              placeholder="Enter custom category"
              placeholderTextColor={colors.textSecondary}
              value={customCategory}
              onChangeText={setCustomCategory}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.switchContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Halfway Alert</Text>
              <Text style={styles.switchDescription}>
                Get notified when the timer reaches 50% completion
              </Text>
            </View>
            <Switch
              value={halfwayAlert}
              onValueChange={setHalfwayAlert}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={!isFormValid}
          >
            <Text style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}>
              Create Timer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}