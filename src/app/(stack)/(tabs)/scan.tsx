import { useState, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";

import { useTheme } from "@components/theme/theme-provider";
import { Text, Button, Card } from "@components/ui";
import { MathEquation } from "@components/math";
import { useMathCapture } from "@hooks/useMathCapture";
import ImageProcessor from "@components/image-processor";

const ScanScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const isFocused = useIsFocused();

  const [scanComplete, setScanComplete] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const { loading, error, result, fetchLatexFromImage } = useMathCapture();

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current?.takePictureAsync();
        if (!photo) return;
        setCapturedPhotoUri(photo.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
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

  const handleProcessedImage = (uri: string) => {
    setImageUri(uri);
    processImage(uri);
    setCapturedPhotoUri(null);
  };

  const resetCamera = () => {
    setScanComplete(false);
    setCapturedPhotoUri(null);
    setImageUri(null);
  };

  const styles = StyleSheet.create({
    cancelButton: {
      backgroundColor: isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
    },
    confirmButton: {
      backgroundColor: colors.primary,
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
      {capturedPhotoUri && (
        <ImageProcessor
          uri={capturedPhotoUri}
          onProcessed={handleProcessedImage}
        />
      )}
      {!scanComplete ? (
        <>
          {imageUri ? (
            <View className="flex-1">
              <Image
                source={{ uri: imageUri }}
                style={{
                  flex: 1,
                  width: "100%",
                }}
                contentFit="contain"
              />
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
                    <Feather name="x" color={isDarkMode ? "#fff" : "#000"} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={styles.confirmButton}
                    onPress={() => setScanComplete(true)}
                  >
                    <Feather name="check" color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View className="flex-1">
              {isFocused && (
                <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />
              )}

              {/* Overlay UI */}
              <View className="flex-1 items-center justify-center">
                <View className="w-3/4 aspect-square border-2 border-white rounded-lg" />
              </View>

              <Card
                variant="elevated"
                className="absolute top-4 left-3 right-3 p-2 items-center"
              >
                <Text variant="body-sm">
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

                <View className="flex-row justify-between mt-2">
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
            </View>
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
                  borderRadius: 8,
                }}
                contentFit="contain"
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
                  <MathEquation
                    equation={result.equation}
                    displayMode
                    size="lg"
                  />
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
                  onPress={() => {
                    if (imageUri) {
                      const encodedUri = Buffer.from(imageUri, "utf8").toString(
                        "base64"
                      );
                      router.push({
                        pathname: "/(stack)/solve/[type]",
                        params: {
                          type: "x",
                          encodedUri: encodedUri,
                        },
                      });
                    }
                  }}
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
        </ScrollView>
      )}
    </View>
  );
};

export default ScanScreen;
