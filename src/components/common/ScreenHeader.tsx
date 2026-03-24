import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title, subtitle, rightElement, showBack = false, onBack,
}) => {
  const theme = useTheme();
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight + 12, borderBottomColor: theme.border, backgroundColor: theme.background }]}>
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={[styles.backText, { color: theme.textSecondary }]}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          {subtitle ? <Text style={[styles.subtitle, { color: theme.textLabel }]}>{subtitle}</Text> : null}
        </View>
        <View style={styles.right}>{rightElement ?? null}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { borderBottomWidth: 0.5, paddingBottom: 12, paddingHorizontal: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 50 },
  backText: { fontSize: 13 },
  titleBlock: { flex: 1, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '500', letterSpacing: -0.2 },
  subtitle: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 },
  right: { width: 50, alignItems: 'flex-end' },
});
