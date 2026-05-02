import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Theme } from '@/src/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 
    | 'display' 
    | 'h1' 
    | 'h2' 
    | 'h3' 
    | 'h4' 
    | 'bodyLg' 
    | 'bodyMd' 
    | 'bodySm' 
    | 'label' 
    | 'caption' 
    | 'amountXl' 
    | 'amountLg' 
    | 'amountMd' 
    | 'amountSm' 
    | 'tag' 
    | 'link'
    | 'default'
    | 'defaultSemiBold'
    | 'title'    // Legacy support
    | 'subtitle'; // Legacy support
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'bodyMd',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        styles[type as keyof typeof styles],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontSize: Theme.typography.sizes.display,
    fontFamily: Theme.typography.fonts.primaryBold,
    lineHeight: Theme.typography.sizes.display * 1.1,
  },
  h1: {
    fontSize: Theme.typography.sizes.h1,
    fontFamily: Theme.typography.fonts.primaryBold,
    lineHeight: Theme.typography.sizes.h1 * 1.2,
  },
  h2: {
    fontSize: Theme.typography.sizes.h2,
    fontFamily: Theme.typography.fonts.primaryBold,
    lineHeight: Theme.typography.sizes.h2 * 1.25,
  },
  h3: {
    fontSize: Theme.typography.sizes.h3,
    fontFamily: Theme.typography.fonts.primarySemiBold,
    lineHeight: Theme.typography.sizes.h3 * 1.3,
  },
  h4: {
    fontSize: Theme.typography.sizes.h4,
    fontFamily: Theme.typography.fonts.primarySemiBold,
    lineHeight: Theme.typography.sizes.h4 * 1.35,
  },
  bodyLg: {
    fontSize: Theme.typography.sizes.bodyLg,
    fontFamily: Theme.typography.fonts.primary,
    lineHeight: Theme.typography.sizes.bodyLg * 1.5,
  },
  bodyMd: {
    fontSize: Theme.typography.sizes.bodyMd,
    fontFamily: Theme.typography.fonts.primary,
    lineHeight: Theme.typography.sizes.bodyMd * 1.5,
  },
  bodySm: {
    fontSize: Theme.typography.sizes.bodySm,
    fontFamily: Theme.typography.fonts.primary,
    lineHeight: Theme.typography.sizes.bodySm * 1.5,
  },
  label: {
    fontSize: Theme.typography.sizes.label,
    fontFamily: Theme.typography.fonts.primaryMedium,
    lineHeight: Theme.typography.sizes.label * 1.4,
  },
  caption: {
    fontSize: Theme.typography.sizes.caption,
    fontFamily: Theme.typography.fonts.primary,
    lineHeight: Theme.typography.sizes.caption * 1.4,
  },
  tag: {
    fontSize: Theme.typography.sizes.tag,
    fontFamily: Theme.typography.fonts.primarySemiBold,
    textTransform: 'uppercase',
  },
  amountXl: {
    fontSize: 40,
    fontFamily: Theme.typography.fonts.monoBold,
  },
  amountLg: {
    fontSize: 32,
    fontFamily: Theme.typography.fonts.monoBold,
  },
  amountMd: {
    fontSize: 24,
    fontFamily: Theme.typography.fonts.monoSemiBold,
  },
  amountSm: {
    fontSize: 16,
    fontFamily: Theme.typography.fonts.monoMedium,
  },
  link: {
    fontSize: Theme.typography.sizes.bodyMd,
    fontFamily: Theme.typography.fonts.primaryMedium,
    color: Theme.colors.primary[600],
  },
  default: {
    fontSize: Theme.typography.sizes.bodyMd,
    fontFamily: Theme.typography.fonts.primary,
  },
  defaultSemiBold: {
    fontSize: Theme.typography.sizes.bodyMd,
    fontFamily: Theme.typography.fonts.primarySemiBold,
  },
  title: {
    fontSize: Theme.typography.sizes.h1,
    fontFamily: Theme.typography.fonts.primaryBold,
  },
  subtitle: {
    fontSize: Theme.typography.sizes.h3,
    fontFamily: Theme.typography.fonts.primarySemiBold,
  },
});
