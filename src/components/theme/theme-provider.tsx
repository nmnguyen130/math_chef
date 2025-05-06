import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "@constants/theme";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeType;
  isDarkMode: boolean;
  setTheme: (theme: ThemeType) => void;
  colors: typeof Colors.light | typeof Colors.dark;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>("system");
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  // Update isDarkMode when theme or system preference changes
  useEffect(() => {
    if (theme === "system") {
      setIsDarkMode(systemColorScheme === "dark");
    } else {
      setIsDarkMode(theme === "dark");
    }
  }, [theme, systemColorScheme]);

  // Get current theme colors
  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider
      value={{ theme, isDarkMode, setTheme, colors: themeColors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
