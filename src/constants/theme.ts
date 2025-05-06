// Color palette
export const Colors = {
  // Primary colors - Educational Blue
  primary: {
    50: "#e6f1ff",
    100: "#cce3ff",
    200: "#99c7ff",
    300: "#66abff",
    400: "#338fff",
    500: "#0073ff", // Main primary color
    600: "#005cd9",
    700: "#0046b3",
    800: "#002f8c",
    900: "#001966",
  },

  // Secondary colors - Purple for creativity
  secondary: {
    50: "#f2e6ff",
    100: "#e5ccff",
    200: "#cc99ff",
    300: "#b266ff",
    400: "#9933ff",
    500: "#8000ff", // Main secondary color
    600: "#6600cc",
    700: "#4d0099",
    800: "#330066",
    900: "#1a0033",
  },

  // Accent colors - Green for growth and learning
  accent: {
    50: "#e6fff2",
    100: "#ccffe5",
    200: "#99ffcc",
    300: "#66ffb2",
    400: "#33ff99",
    500: "#00ff80", // Main accent color
    600: "#00cc66",
    700: "#00994d",
    800: "#006633",
    900: "#00331a",
  },

  // Neutral colors
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },

  // Semantic colors
  success: "#22c55e", // Green
  warning: "#f59e0b", // Amber
  error: "#ef4444", // Red
  info: "#0073ff", // Blue (same as primary)

  // Theme colors
  light: {
    background: "#ffffff",
    card: "#ffffff",
    text: "#171717",
    border: "#e5e5e5",
    primary: "#0073ff",
    secondary: "#8000ff",
    accent: "#00cc66",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#0073ff",
    secondaryText: "#737373",
    highlight: "#f5f5f5",
  },

  dark: {
    background: "#121212",
    card: "#1e1e1e",
    text: "#ffffff",
    border: "#404040",
    primary: "#338fff",
    secondary: "#9933ff",
    accent: "#33ff99",
    success: "#4ade80",
    warning: "#fbbf24",
    error: "#f87171",
    info: "#338fff",
    secondaryText: "#a3a3a3",
    highlight: "#2a2a2a",
  },
} as const;

// Typography
export const Typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  fontWeights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Spacing
export const Spacing = {
  "0": 0,
  "0.5": 2,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 20,
  "6": 24,
  "8": 32,
  "10": 40,
  "12": 48,
  "16": 64,
  "20": 80,
  "24": 96,
  "32": 128,
} as const;

// Border radius
export const BorderRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
} as const;

// Shadows
export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
} as const;

// Math-specific constants
export const MathConstants = {
  equationTypes: {
    linear: "Linear Equation",
    quadratic: "Quadratic Equation",
    trigonometric: "Trigonometric Equation",
    calculus: "Calculus Problem",
  },

  // Default equations for examples
  defaultEquations: {
    linear: "2x + 3 = 7",
    quadratic: "x² - 4x - 5 = 0",
    trigonometric: "4 sin θ cos θ = 2 sin θ",
    calculus: "∫ x² dx",
  },
};
