// AppButton — primary CTA button used throughout the app.
// Reads colours from useTheme() — never has hardcoded values.
// Variants: 'primary' (filled), 'ghost' (outline), 'text' (no border)

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'text';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const containerStyle: ViewStyle = {
    borderRadius: 8,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.4 : 1,
    ...(variant === 'primary' && {
      backgroundColor: theme.buttonBackground,
    }),
    ...(variant === 'ghost' && {
      backgroundColor: 'transparent',
      borderWidth: 0.5,
      borderColor: theme.border,
    }),
    ...(variant === 'text' && {
      backgroundColor: 'transparent',
    }),
  };

  const labelStyle: TextStyle = {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
    ...(variant === 'primary' && { color: theme.buttonText }),
    ...(variant === 'ghost' && { color: theme.textSecondary }),
    ...(variant === 'text' && { color: theme.textLabel }),
  };

  return (
    <TouchableOpacity
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.buttonText : theme.textPrimary}
          size="small"
        />
      ) : (
        <Text style={[labelStyle, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};
