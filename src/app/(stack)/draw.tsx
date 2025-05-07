import { useState } from "react";
import { useRouter } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { useTheme } from "@components/theme/theme-provider";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Text, Button, Icon, Card, Input } from "@components/ui";
import { DrawingCanvas, MathKeyboard } from "@components/math";
import { Colors } from "@constants/theme";

type StrokePath = {
  points: { x: number; y: number }[]; // Adjust if needed
  color: string;
  width: number;
};

const DrawScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("draw");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [paths, setPaths] = useState<StrokePath[]>([]);
  const [equation, setEquation] = useState("");
  const router = useRouter();

  const handlePathsChange = (newPaths: StrokePath[]) => {
    setPaths(newPaths);
  };

  const handleUndo = () => {
    setPaths((prevPaths) => prevPaths.slice(0, prevPaths.length - 1));
  };

  const handleClear = () => {
    setPaths([]);
  };

  const handleSolve = () => {
    router.push("/solve/x");
  };

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setEquation(equation.slice(0, -1));
    } else if (key === "clear") {
      setEquation("");
    } else {
      setEquation(equation + key);
    }
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-black" : "bg-white"}`}>
      {/* Tab Navigation */}
      <View
        className={`flex-row justify-center p-2 border-b ${
          isDarkMode ? "border-neutral-800" : "border-neutral-200"
        }`}
      >
        <View className="flex-row bg-neutral-100 dark:bg-neutral-800 rounded-full p-1">
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              activeTab === "draw" ? "bg-indigo-500" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("draw")}
          >
            <View className="flex-row items-center">
              <Icon className="mr-1">
                <Feather
                  name="edit-3"
                  size={16}
                  color={
                    activeTab === "draw" ? "#fff" : isDarkMode ? "#fff" : "#000"
                  }
                />
              </Icon>
              <Text
                color={
                  activeTab === "draw" ? "#fff" : isDarkMode ? "#fff" : "#000"
                }
              >
                Draw
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              activeTab === "type" ? "bg-indigo-500" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("type")}
          >
            <View className="flex-row items-center">
              <Icon className="mr-1">
                <Ionicons
                  name="calculator"
                  size={16}
                  color={
                    activeTab === "type" ? "#fff" : isDarkMode ? "#fff" : "#000"
                  }
                />
              </Icon>
              <Text
                color={
                  activeTab === "type" ? "#fff" : isDarkMode ? "#fff" : "#000"
                }
              >
                Type
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              activeTab === "scan" ? "bg-indigo-500" : "bg-transparent"
            }`}
            onPress={() => setActiveTab("scan")}
          >
            <View className="flex-row items-center">
              <Icon className="mr-1">
                <Feather
                  name="camera"
                  size={16}
                  color={
                    activeTab === "scan" ? "#fff" : isDarkMode ? "#fff" : "#000"
                  }
                />
              </Icon>
              <Text
                color={
                  activeTab === "scan" ? "#fff" : isDarkMode ? "#fff" : "#000"
                }
              >
                Scan
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 p-4">
        {activeTab === "draw" && (
          <>
            <Card
              variant="outlined"
              className="flex-1 mb-4 p-0 overflow-hidden"
            >
              <DrawingCanvas
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                paths={paths}
                setPaths={setPaths}
              />
              {paths.length === 0 && (
                <View
                  pointerEvents="none"
                  className="absolute inset-0 justify-center items-center"
                >
                  <Text color={colors.secondaryText}>
                    Draw your equation here
                  </Text>
                  <Text
                    variant="body-sm"
                    color={colors.secondaryText}
                    className="mt-2"
                  >
                    Example: 4x + 5y = 6
                  </Text>
                </View>
              )}
            </Card>

            <View className="flex-row justify-between mb-4">
              <View className="flex-row">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Ionicons name="arrow-undo-outline" size={18} />}
                  onPress={handleUndo}
                  className="mr-2"
                  isDisabled={paths.length === 0}
                >
                  Undo
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Feather name="trash-2" size={18} />}
                  onPress={handleClear}
                  isDisabled={paths.length === 0}
                >
                  Clear
                </Button>
              </View>

              <View className="flex-row">
                <Button
                  variant={strokeWidth === 3 ? "primary" : "secondary"}
                  size="sm"
                  leftIcon={<FontAwesome name="pencil" size={18} />}
                  onPress={() => setStrokeWidth(3)}
                  className="mr-2"
                >
                  Pen
                </Button>
                <Button
                  variant={strokeWidth === 6 ? "primary" : "secondary"}
                  size="sm"
                  leftIcon={<FontAwesome name="eraser" size={18} />}
                  onPress={() => setStrokeWidth(6)}
                >
                  Thick
                </Button>
              </View>
            </View>

            <Button
              variant="primary"
              leftIcon={<Feather name="check" />}
              onPress={handleSolve}
              className="w-full"
            >
              Solve
            </Button>
          </>
        )}

        {activeTab === "type" && (
          <>
            <Card variant="outlined" className="mb-4">
              <View className="p-3">
                <Text variant="h3" className="mb-4">
                  Type Your Equation
                </Text>
                <Input
                  placeholder="e.g., x^2 - 4x - 5 = 0"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={equation}
                  onChangeText={setEquation}
                  className="mb-2"
                />
                <Text variant="body-sm" color={Colors.primary[500]}>
                  Use ^ for exponents, * for multiplication, / for division
                </Text>
              </View>
            </Card>

            <MathKeyboard onKeyPress={handleKeyPress} />

            <Button
              variant="primary"
              leftIcon={<Feather name="check" />}
              onPress={() => router.push("/(stack)/solve/x")}
              className="w-full mt-4"
            >
              Solve
            </Button>
          </>
        )}

        {activeTab === "scan" && (
          <View className="flex-1 items-center justify-center">
            <Card variant="outlined" className="p-6 items-center w-full">
              <View className="mb-4">
                <Feather name="camera" size={48} color={Colors.primary[500]} />
              </View>
              <Text className="text-center mb-4">
                Use the camera to scan your math problem
              </Text>
              <Button
                variant="primary"
                onPress={() => router.push("/(stack)/(tabs)/scan")}
              >
                Open Camera
              </Button>
            </Card>
          </View>
        )}
      </View>
    </View>
  );
};

export default DrawScreen;
