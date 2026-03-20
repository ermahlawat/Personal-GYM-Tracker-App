// AppText — enforces the app's typographic scale.
// Use this instead of raw <Text> everywhere so font sizes
// and colours stay consistent across the entire app.
//
// Scale:
//   hero    — 52px / 500 weight / tight tracking  (big stats on home)
//   title   — 22px / 500 weight / -0.3px tracking (screen headings)
//   section — 18px / 500 weight                   (card headings)
//   body    — 13px / 400 weight                   (general text)
//   label   — 10px / 500 weight / uppercase        (field labels)
//   caption — 9px  / 400 weight / uppercase        (timestamps, metadata)

import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

type TextVariant = 'hero' | 'title' | 'section' | 'body' | 'label' | 'caption';
type TextColour = 'primary' | 'secondary' | 'label' | 'caption' | 'accent';

interface AppTextProps {
  variant?: TextVariant;
  colour?: TextColour;
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  colour = 'primary',
  children,
  style,
  numberOfLines,
}) => {
  const theme = useTheme();

  const colourMap: Record<TextColour, string> = {
    primary: theme.textPrimary,
    secondary: theme.textSecondary,
    label: theme.textLabel,
    caption: theme.textCaption,
    accent: theme.accent,
  };

  const variantStyle: TextStyle = (() => {
    switch (variant) {
      case 'hero':
        return {
          fontSize: 52,
          fontWeight: '500',
          letterSpacing: -2,
          lineHeight: 52,
        };
      case 'title':
        return {
          fontSize: 22,
          fontWeight: '500',
          letterSpacing: -0.3,
          lineHeight: 28,
        };
      case 'section':
        return {
          fontSize: 18,
          fontWeight: '500',
          letterSpacing: -0.2,
          lineHeight: 24,
        };
      case 'body':
        return {
          fontSize: 13,
          fontWeight: '400',
          lineHeight: 21,
        };
      case 'label':
        return {
          fontSize: 10,
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          lineHeight: 14,
        };
      case 'caption':
        return {
          fontSize: 9,
          fontWeight: '400',
          textTransform: 'uppercase',
          letterSpacing: 1.0,
          lineHeight: 13,
        };
    }
  })();

  return (
    <Text
      style={[variantStyle, { color: colourMap[colour] }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};
