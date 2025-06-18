import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Download, Trash2 } from 'lucide-react-native';
import { TimerHistory } from '@/types/timer';
import { useThemeContext } from '@/contexts/ThemeContext';
import { loadHistory, saveHistory, exportTimerData } from '@/utils/storage';
import { formatTime, getCategoryColors } from '@/utils/timer';

export default function HistoryScreen() {
  const [history, setHistory] = useState<TimerHistory[]>([]);
  const { colors } = useThemeContext();

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    const historyData = await loadHistory();
    setHistory(historyData);
  };

  const handleExportData = async () => {
    try {
      const exportData = await exportTimerData();
      // In a real app, you would use a file sharing library like react-native-share
      // For now, we'll show an alert with the export data
      Alert.alert(
        'Export Data',
        'Timer data exported successfully! In a production app, this would be saved to a file.',
        [{ text: 'OK' }]
      );
      console.log('Export Data:', exportData);
    } catch (error) {
      Alert.alert('Error', 'Failed to export timer data');
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all timer history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await saveHistory([]);
            setHistory([]);
          },
        },
      ]
    );
  };

  const groupHistoryByDate = (history: TimerHistory[]) => {
    const grouped: Record<string, TimerHistory[]> = {};
    
    history.forEach(item => {
      const date = item.completedAt.toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });

    return grouped;
  };

  const groupedHistory = groupHistoryByDate(history);
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
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 12,
    },
    headerButton: {
      padding: 8,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    scrollView: {
      flex: 1,
      padding: 20,
    },
    dateSection: {
      marginBottom: 24,
    },
    dateHeader: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    historyItem: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    categoryIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
    },
    itemContent: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    itemCategory: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    itemTime: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    itemDuration: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      textAlign: 'right',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      marginBottom: 16,
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

  const totalCompletedTimers = history.length;
  const totalTimeSpent = history.reduce((total, item) => total + item.duration, 0);
  const uniqueCategories = new Set(history.map(item => item.category)).size;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Timer History</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleExportData}>
              <Download size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            {history.length > 0 && (
              <TouchableOpacity style={styles.headerButton} onPress={handleClearHistory}>
                <Trash2 size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {history.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCompletedTimers}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatTime(totalTimeSpent)}</Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{uniqueCategories}</Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
          </View>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Calendar size={64} color={colors.textSecondary} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptySubtitle}>
            Complete some timers and they'll appear here with detailed statistics.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {Object.entries(groupedHistory)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, items]) => (
              <View key={date} style={styles.dateSection}>
                <Text style={styles.dateHeader}>{date}</Text>
                {items
                  .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
                  .map((item, index) => (
                    <View key={`${item.id}-${index}`} style={styles.historyItem}>
                      <View
                        style={[
                          styles.categoryIndicator,
                          {
                            backgroundColor:
                              categoryColors[item.category] || categoryColors.Other,
                          },
                        ]}
                      />
                      <View style={styles.itemContent}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemCategory}>{item.category}</Text>
                        <Text style={styles.itemTime}>
                          {item.completedAt.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                      <Text style={styles.itemDuration}>{formatTime(item.duration)}</Text>
                    </View>
                  ))}
              </View>
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}