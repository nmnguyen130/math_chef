import { View, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@components/theme/theme-provider";
import { Feather } from "@expo/vector-icons";
import { Text, Card, Button } from "@components/ui";
import { MathEquation, StepByStepSolution, GraphView } from "@components/math";
import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";

const SolveScreen = () => {
  const { type, imageData } = useLocalSearchParams();
  const { colors, isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Sample data based on the type parameter
  const getEquation = () => {
    if (type === "x") {
      return {
        title: "Solve for x",
        method: "Steps Using the Quadratic Formula",
        equation: "x² - 4x - 5 = 0",
        steps: [
          {
            explanation:
              "This equation is in standard form: ax² + bx + c = 0. Substitute 1 for a, -4 for b, and -5 for c in the quadratic formula.",
            equation: "(-b ± √(b² - 4ac)) / 2a",
          },
          {
            explanation: "Substitute the values into the formula",
            equation: "x = (-(-4) ± √((-4)² - 4(1)(-5))) / 2(1)",
          },
          {
            explanation: "Simplify the expression",
            equation: "x = (4 ± √(16 + 20)) / 2",
          },
          {
            explanation: "Continue simplifying",
            equation: "x = (4 ± √36) / 2",
          },
          {
            explanation: "Take the square root",
            equation: "x = (4 ± 6) / 2",
          },
          {
            explanation: "Calculate both solutions",
            equation: "x = 5 or x = -1",
          },
        ],
      };
    } else if (type === "θ") {
      return {
        title: "Solve for θ",
        method: "Trigonometric Equation",
        equation: "4 sin θ cos θ = 2 sin θ",
        steps: [
          {
            explanation: "Factor out sin θ from both sides",
            equation: "4 sin θ cos θ = 2 sin θ",
          },
          {
            explanation: "Divide both sides by sin θ (note: sin θ ≠ 0)",
            equation: "4 cos θ = 2",
          },
          {
            explanation: "Divide both sides by 4",
            equation: "cos θ = 1/2",
          },
          {
            explanation: "Find the angles where cos θ = 1/2",
            equation: "θ = π/3 + 2πn or θ = -π/3 + 2πn, n ∈ Z",
          },
        ],
      };
    } else {
      return {
        title: `Solve for ${type}`,
        method: "General Method",
        equation: "Example equation",
        steps: [
          {
            explanation: "Step 1",
            equation: "Example formula",
          },
        ],
      };
    }
  };

  const equationData = getEquation();

  useEffect(() => {
    if (imageData) {
      setIsLoading(false);
    }
  }, [imageData]);

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? "bg-black" : "bg-white"}`}>
      <View className="p-4">
        {imageData && (
          <Card variant="outlined" className="mb-4 bg-black">
            <Image
              source={{ uri: imageData as string }}
              style={{ height: 200, aspectRatio: 1, alignSelf: "center" }}
              resizeMode="contain"
            />
          </Card>
        )}

        {isLoading ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text variant="body" className="mt-2">
              Processing your equation...
            </Text>
          </View>
        ) : (
          <>
            <View className="mb-4">
              <Text variant="h2">{equationData.title}</Text>
              <Text variant="body" className="mt-1">
                {equationData.method}
              </Text>
            </View>

            <Card variant="outlined" className="mb-4">
              <MathEquation equation={equationData.equation} size="md" />
              <View className="flex-row justify-end mt-2">
                <Button
                  variant="ghost"
                  leftIcon={<Feather name="edit" size={20} />}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  leftIcon={<Feather name="bookmark" size={20} />}
                >
                  Save
                </Button>
              </View>
            </Card>

            <Text variant="h3" className="mt-2">
              Solution Steps
            </Text>

            <StepByStepSolution steps={equationData.steps} />

            {type === "x" && (
              <View className="mt-6">
                <Text variant="h3" style={{ marginBottom: 16 }}>
                  Graph
                </Text>
                <GraphView equation={equationData.equation} height={240} />
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default SolveScreen;
