import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter } from 'lucide-react-native';
import { useTimerContext } from '@/contexts/TimerContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Timer } from '@/types/timer';
import CategorySection from '@/components/CategorySection';
import CompletionModal from '@/components/CompletionModal';

export default function HomeScreen() {
  const { timers, dispatch, setOnTimerComplete } = useTimerContext();
  const { colors } = useThemeContext();
  const [completedTimer, setCompletedTimer] = useState<Timer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Set up timer completion callback
  React.useEffect(() => {
    setOnTimerComplete((timer) => {
      setCompletedTimer(timer);
    });
  }, [setOnTimerComplete]);

  // Group timers by category
  const groupedTimers = useMemo(() => {
    let filteredTimers = timers;

    // Filter by search query
    if (searchQuery.trim()) {
      filteredTimers = filteredTimers.filter(timer =>
        timer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        timer.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filteredTimers = filteredTimers.filter(timer => timer.category === selectedCategory);
    }

    // Group by category
    const grouped = filteredTimers.reduce((acc, timer) => {
      if (!acc[timer.category]) {
        acc[timer.category] = [];
      }
      acc[timer.category].push(timer);
      return acc;
    }, {} as Record<string, Timer[]>);

    // Sort timers within each category by status (running first, then paused, then idle, then completed)
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => {
        const statusOrder = { running: 0, paused: 1, idle: 2, completed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    });

    return grouped;
  }, [timers, searchQuery, selectedCategory]);

  const categories = ['All', ...Array.from(new Set(timers.map(timer => timer.category)))];

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
      marginBottom: 16,
    },
    searchContainer: {
      marginBottom: 16,
    },
    searchInput: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: colors.text,
    },
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    filterIcon: {
      marginRight: 8,
    },
    categoryFilter: {
      flexDirection: 'row',
      gap: 8,
    },
    categoryButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    selectedCategoryButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.text,
    },
    selectedCategoryButtonText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      padding: 20,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });

  const handleStartTimer = (id: string) => {
    dispatch({ type: 'START_TIMER', payload: id });
  };

  const handlePauseTimer = (id: string) => {
    dispatch({ type: 'PAUSE_TIMER', payload: id });
  };

  const handleResetTimer = (id: string) => {
    dispatch({ type: 'RESET_TIMER', payload: id });
  };

  const handleDeleteTimer = (id: string) => {
    dispatch({ type: 'DELETE_TIMER', payload: id });
  };

  const handleStartCategory = (category: string) => {
    dispatch({ type: 'START_CATEGORY', payload: category });
  };

  const handlePauseCategory = (category: string) => {
    dispatch({ type: 'PAUSE_CATEGORY', payload: category });
  };

  const handleResetCategory = (category: string) => {
    dispatch({ type: 'RESET_CATEGORY', payload: category });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Timers</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search timers..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          <Filter size={16} color={colors.textSecondary} style={styles.filterIcon} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.selectedCategoryButtonText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <View style={styles.content}>
        {Object.keys(groupedTimers).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No timers found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search or filter settings'
                : 'Create your first timer to get started'}
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {Object.entries(groupedTimers).map(([category, categoryTimers]) => (
              <CategorySection
                key={category}
                category={category}
                timers={categoryTimers}
                onStartTimer={handleStartTimer}
                onPauseTimer={handlePauseTimer}
                onResetTimer={handleResetTimer}
                onDeleteTimer={handleDeleteTimer}
                onStartCategory={handleStartCategory}
                onPauseCategory={handlePauseCategory}
                onResetCategory={handleResetCategory}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <CompletionModal
        visible={!!completedTimer}
        timer={completedTimer}
        onClose={() => setCompletedTimer(null)}
      />
    </SafeAreaView>
  );
}