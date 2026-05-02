import { Shadows } from './shadows';

export const Theme = {
  // 1. Color System
  colors: {
    // Primary Palette — Forest Green
    primary: {
      950: '#062d18', // Dark mode cards, deep hero backgrounds
      800: '#186338', // Dark accents, hover states on dark surfaces
      700: '#177e42', // Active states, pressed buttons
      600: '#19a051', // Primary brand color — CTAs, active icons, links
      500: '#2dd673', // Highlight accents, income indicators
      400: '#4ddb87', // Hover states on light backgrounds
      300: '#88edb1', // Progress fill (early stage)
      200: '#bcf6d3', // Subtle tints, chip backgrounds
      100: '#ddfbe9', // Surface highlights, selected card tint
      50: '#f0fdf5',  // Hover backgrounds, sheet surfaces
      30: '#E8F5E9',  // Page-level tint backgrounds
    },

    // Neutral Palette
    neutral: {
      900: '#1F2223', // Primary text, headings
      800: '#363939', // Secondary headings, dark labels
      700: '#57595A', // Body text on light backgrounds
      600: '#797A7B', // Secondary text, metadata
      500: '#8E9090', // Placeholder text
      400: '#B1B2B2', // Disabled text
      300: '#D2D3D3', // Dividers, light borders
      200: '#EAEAEA', // Default input borders, card borders
      100: '#F6F6F6', // Subtle backgrounds, skeleton loaders
      white: '#FFFFFF', // Card surfaces, modals
      whiteBg: '#F8F9FB', // App-level background
    },

    // Semantic / Feedback Colors
    semantic: {
      error: '#EF4444',        // R500
      errorLight: '#F3E6E7',   // R100
      errorBorder: '#FCA5A5',  // R300
      warning: '#F59E0B',      // O500
      warningLight: '#FEF3C7', // O100
      warningBorder: '#FCD34D',// O300
      success: '#19a051',      // P600
      successLight: '#ddfbe9', // P100
      income: '#2ECC71',       // ACCENT_GREEN
    },

    // Legacy / Convenience Aliases
    brand: '#19a051',      // PRIMARY_GREEN
    text: '#1F2223',       // BLACK
    background: '#F8F9FB', // BACKGROUND
    card: '#FFFFFF',
    border: '#EAEAEA',
  },

  // 2. Typography
  typography: {
    fonts: {
      primary: 'PlusJakartaSans_400Regular',
      primaryMedium: 'PlusJakartaSans_500Medium',
      primarySemiBold: 'PlusJakartaSans_600SemiBold',
      primaryBold: 'PlusJakartaSans_700Bold',
      mono: 'GeistMono_400Regular',
      monoMedium: 'GeistMono_500Medium',
      monoSemiBold: 'GeistMono_600SemiBold',
      monoBold: 'GeistMono_700Bold',
    },
    sizes: {
      display: 40,
      h1: 32,
      h2: 24,
      h3: 20,
      h4: 18,
      bodyLg: 16,
      bodyMd: 14,
      bodySm: 12,
      label: 13,
      caption: 11,
      tag: 11,
    }
  },

  // 3. Spacing System
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    screenPadding: 24,
  },

  // 4. Border Radius
  radius: {
    hero: 20,
    card: 16,
    compact: 12,
    button: 14,
    input: 12,
    chip: 99,
    badge: 6,
    modal: 20,
    sheet: 24,
  },

  // 5. Elevation & Shadows
  shadows: Shadows,
};

// Maintaining Colors export for existing components that might use it
export const Colors = {
  light: {
    text: Theme.colors.neutral[900],
    background: Theme.colors.neutral.whiteBg,
    tint: Theme.colors.primary[600],
    icon: Theme.colors.neutral[600],
    tabIconDefault: Theme.colors.neutral[400],
    tabIconSelected: Theme.colors.primary[600],
  },
  dark: {
    text: '#ECEDEE', // Dark mode not fully specified yet, keeping defaults
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};
