import "../global.css";
import { Stack } from "expo-router";
import ThemeProvider, { useTheme } from "@components/theme/theme-provider";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(stack)",
};

const RootLayoutNav = () => {
  const { colors, isDarkMode } = useTheme();
  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-black" : "bg-white"}`}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
};

const RootLayout = () => {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
};

export default RootLayout;
