import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@components/theme/theme-provider";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Text, Card, Button } from "@components/ui";
import { KaTeXInline, MathEquation } from "@components/math";

type RoutePath =
  | "/(stack)/draw"
  | "/(stack)/(tabs)/scan"
  | "/(stack)/solve/x"
  | "/(stack)/(tabs)/practice"
  | "/(stack)/(tabs)/videos";

const HomeScreen = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const features: {
    title: string;
    description: string;
    icon: React.ReactNode;
    route: RoutePath;
  }[] = [
    {
      title: "Draw Equations",
      description: "Write naturally as on paper",
      icon: <FontAwesome name="pencil" size={20} color={colors.primary} />,
      route: "/(stack)/draw",
    },
    {
      title: "Scan & Solve",
      description: "Take a photo of your math problem",
      icon: <Feather name="camera" size={20} color={colors.secondary} />,
      route: "/(stack)/(tabs)/scan",
    },
    {
      title: "Step-by-Step",
      description: "Get detailed explanations",
      icon: <Feather name="book-open" size={20} color={colors.accent} />,
      route: "/(stack)/solve/x",
    },
    {
      title: "Practice Problems",
      description: "Improve your skills with examples",
      icon: <Feather name="book" size={20} color={colors.primary} />,
      route: "/(stack)/(tabs)/practice",
    },
    {
      title: "Tutorial Videos",
      description: "Learn from expert instructors",
      icon: <Feather name="video" size={20} color={colors.secondary} />,
      route: "/(stack)/(tabs)/videos",
    },
  ];

  const recentProblems = [
    {
      equation: "a^2 + b^2 = c^2",
      type: "Quadratic Equation",
      color: colors.primary,
    },
    {
      equation: "4 sin θ cos θ = 2 sin θ",
      type: "Trigonometric Equation",
      color: colors.secondary,
    },
  ];

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className="p-4">
        {/* Header with gradient background */}
        <View
          className="rounded-2xl mb-6 p-6"
          style={{
            backgroundColor: isDarkMode
              ? `${colors.primary}20`
              : `${colors.primary}10`,
          }}
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text variant="h1" color={colors.primary}>
              Math Chef
            </Text>
            <TouchableOpacity
              className="rounded-full p-2"
              style={{
                backgroundColor: isDarkMode
                  ? `${colors.primary}30`
                  : `${colors.primary}20`,
              }}
              onPress={() => router.push("/(stack)/(tabs)/settings")}
            >
              <Feather name="settings" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text color={colors.secondaryText} className="mb-4">
            Solve any math problem with ease
          </Text>

          <View className="flex-row mt-1">
            <Button
              variant="primary"
              onPress={() => router.push("/(stack)/draw")}
              className="flex-1 mr-2"
            >
              Start Solving
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push("/(stack)/(tabs)/practice")}
              className="flex-1"
            >
              Practice
            </Button>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-4">
          <Text variant="h3" className="mb-4">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {features.slice(0, 3).map((feature, index) => (
              <TouchableOpacity
                key={index}
                className="p-3 border-hairline rounded-xl mb-3 flex items-center justify-center"
                style={{
                  width: "30%",
                  backgroundColor: isDarkMode
                    ? `${colors.primary}15`
                    : `${colors.primary}05`,
                  borderColor: isDarkMode
                    ? `${colors.primary}30`
                    : `${colors.primary}20`,
                }}
                onPress={() => router.push(feature.route)}
              >
                <View className="mb-2">{feature.icon}</View>
                <Text weight="semibold" variant="body-sm">
                  {feature.title.split(" ")[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features */}
        <View className="mb-6">
          <Text variant="h3" className="mb-4">
            Features
          </Text>
          {features.map((feature, index) => (
            <Card
              key={index}
              variant="outlined"
              onPress={() => router.push(feature.route)}
              className="mb-3"
            >
              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  style={{
                    backgroundColor: isDarkMode
                      ? `${colors.primary}15`
                      : `${colors.primary}05`,
                  }}
                >
                  {feature.icon}
                </View>
                <View className="flex-1">
                  <Text weight="semibold">{feature.title}</Text>
                  <Text variant="body-sm" color={colors.secondaryText}>
                    {feature.description}
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={colors.secondaryText}
                />
              </View>
            </Card>
          ))}
        </View>

        {/* Recent Problems */}
        <View>
          <View className="flex-row justify-between items-center mb-4">
            <Text variant="h3">Recent Problems</Text>
            <TouchableOpacity>
              <Text color={colors.primary}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginVertical: 16 }}>
            <KaTeXInline
              expression={
                "This is an equation: \\(a^2 + b^2 = c^2\\) in the middle of text"
              }
            />
          </View>

          {recentProblems.map((problem, index) => (
            <Card
              key={index}
              variant="outlined"
              onPress={() => router.push("/(stack)/solve/x")}
              className="mb-3 overflow-hidden"
            >
              <View
                className="h-1 w-full"
                style={{
                  backgroundColor:
                    index === 0 ? colors.primary : colors.secondary,
                }}
              />
              <View className="py-2 px-3">
                <MathEquation
                  equation={problem.equation}
                  bordered
                  displayMode
                />
                <View className="flex-row justify-between items-center mt-2">
                  <Text variant="body-sm" color={colors.secondaryText}>
                    {problem.type}
                  </Text>
                  <View className="flex-row items-center">
                    <View className="mr-2">
                      <FontAwesome
                        name="lightbulb-o"
                        size={20}
                        color={problem.color}
                      />
                    </View>
                    <Text variant="body-sm" color={problem.color}>
                      Solved
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}

          <Button
            variant="primary"
            className="mt-3"
            onPress={() => router.push("/(stack)/solve/x")}
          >
            Solve New Problem
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
