import { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Buffer } from "buffer";

import { Text, Card, Button } from "@components/ui";
import { useTheme } from "@components/theme/theme-provider";
import { MathEquation, StepByStepSolution, GraphView } from "@components/math";
import { useMathCapture } from "@hooks/useMathCapture";
import { useEquationSolver } from "@hooks/useEquationSolver";

const SolveScreen = () => {
  const { type, encodedUri } = useLocalSearchParams<{
    type: string;
    encodedUri: string;
  }>();
  const { colors, isDarkMode } = useTheme();
  const imageUri = Buffer.from(encodedUri, "base64").toString("utf8");

  const [isLoading, setIsLoading] = useState(true);
  const [equationData, setEquationData] = useState({
    type: "",
    equation: "",
    steps: [],
  });

  const {
    error: errorCapture,
    result: resultCapture,
    fetchLatexFromImage,
  } = useMathCapture();

  const {
    error: errorSolver,
    result: resultSolver,
    solveEquation,
  } = useEquationSolver();

  useEffect(() => {
    if (imageUri) {
      fetchLatexFromImage(imageUri);
    }
  }, [imageUri]);

  useEffect(() => {
    if (resultCapture?.equation) {
      const detectedEquation = resultCapture.equation;
      setEquationData((prev) => ({
        ...prev,
        equation: detectedEquation,
      }));

      solveEquation(detectedEquation, "solve for x");
    }
  }, [resultCapture]);

  useEffect(() => {
    if (resultSolver) {
      setEquationData((prev) => ({
        ...prev,
        steps: resultSolver.steps || [],
      }));
      setIsLoading(false);
    }
  }, [resultSolver]);

  useEffect(() => {
    if (errorCapture || errorSolver) {
      setIsLoading(false);
    }
  }, [errorCapture, errorSolver]);

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? "bg-black" : "bg-white"}`}>
      <View className="p-4">
        {imageUri && (
          <Card variant="outlined" className="mb-4 bg-black">
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: 200, alignSelf: "center" }}
              contentFit="contain"
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
              <Text variant="h3" className="mt-1">
                {equationData.type}
              </Text>
            </View>

            <Card variant="outlined" className="mb-4">
              <MathEquation
                equation={equationData.equation}
                displayMode
                size="lg"
              />
              <View className="flex-row justify-end mt-2">
                <Button
                  variant="ghost"
                  leftIcon={
                    <Feather name="edit" size={16} color={colors.primary} />
                  }
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  leftIcon={
                    <Feather name="bookmark" size={16} color={colors.primary} />
                  }
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
