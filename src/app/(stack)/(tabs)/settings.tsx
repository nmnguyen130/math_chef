import { View, ScrollView, Switch } from "react-native";
import { useTheme } from "@components/theme/theme-provider";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Text, Card, Button } from "@components/ui";

const SettingsScreen = () => {
  const { colors, isDarkMode, theme, setTheme } = useTheme();

  const themeOptions = [
    {
      label: "Light Mode",
      value: "light",
      icon: <Feather name="sun" size={20} color={colors.primary} />,
    },
    {
      label: "Dark Mode",
      value: "dark",
      icon: <Feather name="moon" size={20} color={colors.primary} />,
    },
    {
      label: "System Default",
      value: "system",
      icon: <Feather name="info" size={20} color={colors.primary} />,
    },
  ];

  const notificationOptions = [
    { label: "Push Notifications", value: true },
    { label: "Email Notifications", value: false },
  ];

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? "bg-black" : "bg-white"}`}>
      <View className="p-4">
        <Text variant="h2" className="mb-3">
          Settings
        </Text>

        <View className="mb-6">
          <Text variant="h3" className="mb-3">
            Appearance
          </Text>
          <Card variant="outlined">
            {themeOptions.map((option, index) => (
              <Button
                key={index}
                variant="ghost"
                onPress={() => setTheme(option.value as any)}
                style={{
                  justifyContent: "space-between",
                  borderBottomWidth: index < themeOptions.length - 1 ? 1 : 0,
                  borderBottomColor: isDarkMode ? "#404040" : "#e5e5e5",
                  borderRadius: 0,
                  paddingVertical: 12,
                }}
              >
                <View className="flex-row items-center">
                  <View className="mr-3">{option.icon}</View>
                  <Text>{option.label}</Text>
                </View>
                <View className="h-5 w-5 border border-neutral-400 rounded-full items-center justify-center">
                  {theme === option.value && (
                    <View className="h-3 w-3 rounded-full bg-blue-500" />
                  )}
                </View>
              </Button>
            ))}
          </Card>
        </View>

        <View className="mb-6">
          <Text variant="h3" className="mb-3">
            Notifications
          </Text>
          <Card variant="outlined">
            {notificationOptions.map((option, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between py-1 px-4"
                style={{
                  borderBottomWidth:
                    index < notificationOptions.length - 1 ? 1 : 0,
                  borderBottomColor: isDarkMode ? "#404040" : "#e5e5e5",
                }}
              >
                <View className="flex-row items-center">
                  <View className="mr-3">
                    <Feather name="bell" size={20} color={colors.primary} />
                  </View>
                  <Text>{option.label}</Text>
                </View>
                <Switch value={option.value} />
              </View>
            ))}
          </Card>
        </View>

        <View className="mb-6">
          <Text variant="h3" className="mb-3">
            Language
          </Text>
          <Button
            variant="outline"
            leftIcon={
              <FontAwesome name="language" size={20} color={colors.primary} />
            }
            style={{ justifyContent: "space-between" }}
          >
            <Text>English (US)</Text>
            <Text color={isDarkMode ? "#a3a3a3" : "#737373"}>Change</Text>
          </Button>
        </View>

        <View>
          <Text variant="h3" className="mb-3">
            Help & Support
          </Text>
          <Button
            variant="outline"
            leftIcon={
              <Feather name="help-circle" size={20} color={colors.primary} />
            }
            className="mb-2"
          >
            Help Center
          </Button>
          <Button
            variant="outline"
            leftIcon={<Feather name="info" size={20} color={colors.primary} />}
          >
            About
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;
