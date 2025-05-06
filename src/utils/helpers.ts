import { Dimensions, Platform } from "react-native";
import { Colors } from "../constants/theme";

// Get screen dimensions
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

// Check if device is iOS
export const isIOS = Platform.OS === "ios";

// Check if device is Android
export const isAndroid = Platform.OS === "android";

// Get dynamic color based on theme
export const getThemeColor = (
  colorKey: keyof typeof Colors.light,
  isDarkMode: boolean
) => {
  return isDarkMode ? Colors.dark[colorKey] : Colors.light[colorKey];
};

// Parse LaTeX or math expressions
export const parseMathExpression = (expression: string): string => {
  // This is a placeholder for a more complex parser
  // In a real app, you might use a library like math.js or MathJax
  return expression;
};

// Generate a random math problem based on type
export const generateRandomProblem = (type: string): string => {
  switch (type) {
    case "linear":
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      const c = Math.floor(Math.random() * 50) + 1;
      return `${a}x + ${b} = ${c}`;

    case "quadratic":
      const p = Math.floor(Math.random() * 10) + 1;
      const q = Math.floor(Math.random() * 20) - 10;
      const r = Math.floor(Math.random() * 20) - 10;
      return `${p}x² ${q >= 0 ? "+" : ""}${q}x ${r >= 0 ? "+" : ""}${r} = 0`;

    default:
      return "x + 2 = 5";
  }
};

// Validate user input for math expressions
export const validateMathExpression = (expression: string): boolean => {
  // Basic validation - check for balanced parentheses
  const stack: string[] = [];

  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === "(") {
      stack.push("(");
    } else if (expression[i] === ")") {
      if (stack.length === 0) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
};

// Format time for timers (e.g., for practice sessions)
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
