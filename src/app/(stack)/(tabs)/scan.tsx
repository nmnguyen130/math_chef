import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@components/theme/theme-provider";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import {} from "@expo/vector-icons";
import { Text, Button, Icon, Card } from "@components/ui";
import { MathEquation } from "@components/math";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import { useMathCapture } from "@hooks/useMathCapture";

const ScanScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  const [scanComplete, setScanComplete] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const { loading, error, result, fetchLatexFromImage } = useMathCapture();

  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current?.takePictureAsync();
        if (!photo) return;

        setImageUri(photo.uri);
        processImage(photo.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    await fetchLatexFromImage(uri);
    setIsProcessing(false);
    setScanComplete(true);
  };

  const resetCamera = () => {
    setImageUri(null);
    setScanComplete(false);
  };

  const styles = StyleSheet.create({
    cancelButton: {
      backgroundColor: isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
    },
    confirmButton: {
      backgroundColor: colors.primary,
    },
    highlightedCard: {
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    graphPlaceholder: {
      height: 160,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDarkMode ? colors.highlight : "#f5f5f5",
      borderRadius: 8,
      marginTop: 8,
    },
  });

  if (!cameraPermission?.granted) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center mb-4">
          Camera access is required to use this feature.
        </Text>
        <Button variant="primary" onPress={requestCameraPermission}>
          Grant Camera Permission
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {!scanComplete ? (
        <>
          {imageUri ? (
            <View className="flex-1">
              <Image source={{ uri: imageUri }} style={{ flex: 1 }} />
              {isProcessing ? (
                <View className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Card
                    variant="elevated"
                    className="p-6 w-4/5 flex items-center"
                  >
                    <Text className="text-center mb-4">
                      Processing image...
                    </Text>
                    <View
                      className="h-2 w-full rounded overflow-hidden my-4"
                      style={{ backgroundColor: colors.highlight }}
                    >
                      <View
                        className="h-full w-3/4"
                        style={{ backgroundColor: colors.primary }}
                      />
                    </View>
                    <Text variant="body-sm" className="text-center">
                      Analyzing math equation...
                    </Text>
                  </Card>
                </View>
              ) : (
                <View className="absolute bottom-0 left-0 right-0 p-4 flex flex-row justify-between">
                  <TouchableOpacity
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={styles.cancelButton}
                    onPress={resetCamera}
                  >
                    <Icon>
                      <Feather name="x" color={isDarkMode ? "#fff" : "#000"} />
                    </Icon>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={styles.confirmButton}
                    onPress={() => setScanComplete(true)}
                  >
                    <Icon>
                      <Feather name="check" color="#fff" />
                    </Icon>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <CameraView ref={cameraRef} style={{ flex: 1 }}>
              <View className="flex-1 items-center justify-center">
                <View
                  className="w-3/4 h-1/4 border-2 rounded-xl"
                  style={{ borderColor: colors.primary }}
                />
              </View>

              <Card
                variant="elevated"
                className="absolute top-4 left-3 right-3 p-2"
              >
                <Text variant="body-sm" className="text-center">
                  Position your math problem within the frame
                </Text>
              </Card>

              <View className="absolute bottom-0 left-0 right-0 p-3">
                <View className="flex-row justify-center">
                  <TouchableOpacity
                    className="w-16 h-16 border-4 rounded-full bg-white items-center justify-center"
                    style={{ borderColor: colors.primary }}
                    onPress={takePicture}
                  >
                    <View
                      className="w-12 h-12 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-between">
                  <Button
                    variant="primary"
                    leftIcon={<Feather name="image" size={20} color={"#fff"} />}
                    onPress={pickImage}
                    style={{
                      width: "30%",
                      borderColor: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    Gallery
                  </Button>

                  <Button
                    variant="primary"
                    leftIcon={<Ionicons name="scan" size={20} color={"#fff"} />}
                    style={{
                      width: "30%",
                      borderColor: "white",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    Tips
                  </Button>
                </View>
              </View>
            </CameraView>
          )}
        </>
      ) : (
        <ScrollView className="flex-1 px-4 mt-2">
          <Text variant="h2" className="mb-4">
            Algebra Assignment
          </Text>

          {imageUri && (
            <View className="items-center justify-center mb-4">
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: "100%",
                  height: 200,
                  aspectRatio: 4 / 3,
                  borderRadius: 8,
                }}
                contentFit="cover"
              />
            </View>
          )}

          {result ? (
            <>
              <Card variant="outlined" className="mb-4">
                <View className="px-3">
                  <Text weight="medium" className="mb-2">
                    Detected Equation
                  </Text>
                  <MathEquation equation={result.latex} />
                </View>
              </Card>

              <Card variant="outlined" style={styles.highlightedCard}>
                <View className="px-3">
                  <Text weight="medium" className="mb-2">
                    Solution
                  </Text>
                  <MathEquation equation={result.solution} isHighlighted />
                  <View className="flex-row items-center mt-2">
                    <View className="mr-2">
                      <FontAwesome
                        name="lightbulb-o"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <Text color={colors.primary}>Solution found</Text>
                  </View>
                </View>
              </Card>

              <View className="flex-row my-2">
                <Button
                  variant="outline"
                  leftIcon={
                    <Feather name="check" size={20} color={colors.primary} />
                  }
                  className="flex-1 mr-2"
                  onPress={resetCamera}
                >
                  Scan Another
                </Button>

                <Button
                  variant="primary"
                  className="flex-1"
                  onPress={() => router.push("/(stack)/solve/x")}
                >
                  Solve
                </Button>
              </View>
            </>
          ) : error ? (
            <View className="flex my-2">
              <Card variant="outlined" className="mb-4">
                <View className="p-3">
                  <Text color="red">Error: {error}</Text>
                </View>
              </Card>

              <Button
                variant="outline"
                leftIcon={
                  <Feather name="check" size={20} color={colors.primary} />
                }
                className="flex-1 mr-2"
                onPress={resetCamera}
              >
                Scan Another
              </Button>
            </View>
          ) : (
            <Text>Waiting for result...</Text>
          )}

          {/* <Card variant="outlined" className="mb-4">
            <View className="p-3">
              <Text weight="medium" className="mb-2">
                1. Solve the linear equation
              </Text>
              <MathEquation equation="(2x-3)/5 + (4x-1)/10 = 1" />
            </View>
          </Card>

          <Card variant="outlined" style={styles.highlightedCard}>
            <View className="p-3">
              <Text weight="medium" className="mb-2">
                Solve for x
              </Text>
              <MathEquation equation="x = 17/8 - 1/8 = 2.125" isHighlighted />
              <View className="flex-row items-center mt-2">
                <Icon className="mr-2">
                  <Lightbulb size={16} color={colors.primary} />
                </Icon>
                <Text color={colors.primary}>Solution found</Text>
              </View>
            </View>
          </Card>

          <Text weight="medium" className="mb-2">
            Steps for Solving Linear Equation
          </Text>

          <Button
            variant="primary"
            className="mb-4"
            onPress={() => router.push("/(stack)/solve/x")}
          >
            Get step-by-step solution
          </Button>

          <Card variant="outlined" className="mb-4">
            <View className="p-3">
              <Text weight="medium" className="mb-2">
                Graph
              </Text>
              <View style={styles.graphPlaceholder}>
                <Text color={colors.secondaryText}>
                  Graph visualization would appear here
                </Text>
              </View>
            </View>
          </Card>

          <View className="flex-row my-2">
            <Button
              variant="outline"
              leftIcon={<Check color={colors.primary} />}
              className="flex-1 mr-2"
              onPress={resetCamera}
            >
              Scan Another
            </Button>

            <Button
              variant="primary"
              className="flex-1"
              onPress={() => router.push("/(stack)/solve/x")}
            >
              Solve
            </Button>
          </View> */}
        </ScrollView>
      )}
    </View>
  );
};

export default ScanScreen;
