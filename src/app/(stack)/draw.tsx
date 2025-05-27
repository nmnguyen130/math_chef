import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@components/theme/theme-provider";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Text, Button, Card, Input } from "@components/ui";
import { DrawingCanvas, MathKeyboard } from "@components/math";
import { Colors } from "@constants/theme";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

type StrokePath = {
  points: { x: number; y: number }[];
  color: string;
  width: number;
};

const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Canvas Export</title>
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <script>
      document.addEventListener('message', function(event) {
        const paths = JSON.parse(event.data);
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Get the bounding box of all points
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        paths.forEach(path => {
          path.points.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.y);
            maxY = Math.max(maxY, point.y);
          });
        });

        // Calculate the width and height of the bounding box
        const originalWidth = maxX - minX;
        const originalHeight = maxY - minY;

        // Set canvas size to match the bounding box
        canvas.width = originalWidth;
        canvas.height = originalHeight;

        // Translate the context to the minimum point
        ctx.translate(-minX, -minY);

        // Draw the paths
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        paths.forEach(path => {
          ctx.beginPath();
          path.points.forEach((point, i) => {
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.strokeStyle = path.color;
          ctx.lineWidth = path.width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        });

        // Create a new canvas with fixed size 400x400
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = 400;
        exportCanvas.height = 400;
        const exportCtx = exportCanvas.getContext('2d');

        // Draw the original canvas onto the export canvas
        const scale = Math.min(400 / originalWidth, 400 / originalHeight);
        const offsetX = (400 - originalWidth * scale) / 2;
        const offsetY = (400 - originalHeight * scale) / 2;

        exportCtx.fillStyle = 'white'; // hoặc transparent
        exportCtx.fillRect(0, 0, 400, 400);

        exportCtx.scale(scale, scale);
        exportCtx.translate(offsetX / scale, offsetY / scale);
        exportCtx.drawImage(canvas, 0, 0);

        // Get the data URL
        const dataUrl = exportCanvas.toDataURL('image/png');
        window.ReactNativeWebView.postMessage(dataUrl);
      });
    </script>
  </body>
</html>
`;

const DrawScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("draw");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [paths, setPaths] = useState<StrokePath[]>([]);
  const [equation, setEquation] = useState("");
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUndo = () => {
    setPaths((prevPaths) => prevPaths.slice(0, -1));
  };

  const handleClear = () => {
    setPaths([]);
  };

  const handleSolve = async () => {
    try {
      setIsLoading(true);
      const pathsString = JSON.stringify(paths);
      webViewRef.current?.postMessage(pathsString);
    } catch (error) {
      console.error("Error exporting canvas:", error);
    }
  };

  // Handle WebView messages
  const handleWebViewMessage = async (event: any) => {
    const imageData = event.nativeEvent.data;

    try {
      const base64Data = imageData.replace(/^data:image\/png;base64,/, "");

      const fileUri = `${FileSystem.cacheDirectory}drawing-${Date.now()}.png`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const encodedUri = Buffer.from(fileUri, "utf8").toString("base64");

      router.push({
        pathname: "/solve/[type]",
        params: {
          type: "image",
          encodedUri: encodedUri,
        },
      });
    } catch (error) {
      console.error("Failed to handle WebView image data:", error);
    } finally {
      setIsLoading(false);
    }
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
    <>
      {/* Hidden WebView for canvas operations */}
      <View className="hidden">
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
        />
      </View>

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
                <View className="mr-1">
                  <Feather
                    name="edit-3"
                    size={16}
                    color={
                      activeTab === "draw"
                        ? "#fff"
                        : isDarkMode
                        ? "#fff"
                        : "#000"
                    }
                  />
                </View>
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
                <View className="mr-1">
                  <Ionicons
                    name="calculator"
                    size={16}
                    color={
                      activeTab === "type"
                        ? "#fff"
                        : isDarkMode
                        ? "#fff"
                        : "#000"
                    }
                  />
                </View>
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
                <View className="mr-1">
                  <Feather
                    name="camera"
                    size={16}
                    color={
                      activeTab === "scan"
                        ? "#fff"
                        : isDarkMode
                        ? "#fff"
                        : "#000"
                    }
                  />
                </View>
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
                leftIcon={
                  !isLoading && (
                    <Feather name="check" size={20} color={colors.background} />
                  )
                }
                onPress={handleSolve}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  "Solve"
                )}
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
                  <Feather
                    name="camera"
                    size={48}
                    color={Colors.primary[500]}
                  />
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
    </>
  );
};

export default DrawScreen;
