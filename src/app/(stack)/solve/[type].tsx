import { View, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@components/theme/theme-provider";
import { Feather } from "@expo/vector-icons";
import { Text, Card, Button } from "@components/ui";
import { MathEquation, StepByStepSolution, GraphView } from "@components/math";
import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useMathCapture } from "@hooks/useMathCapture";

const SolveScreen = () => {
  const { type, imageData } = useLocalSearchParams();
  const { colors, isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [equationData, setEquationData] = useState({
    type: "",
    equation: "",
    steps: [],
  });

  const { loading, error, result, fetchLatexFromImage } = useMathCapture();

  useEffect(() => {
    if (imageData) {
      fetchLatexFromImage(imageData as string);
    }
  }, [imageData]);

  useEffect(() => {
    if (result) {
      setEquationData((prev) => ({
        ...prev,
        equation: result.equation || "",
      }));
      setIsLoading(false);
    }
  }, [result]);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
    }
  }, [error]);

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
              <Text variant="h3" className="mt-1">
                {equationData.type}
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
