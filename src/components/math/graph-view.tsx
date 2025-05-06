import React from "react";
import { View, Dimensions } from "react-native";
import { Card, Text } from "@components/ui";
import { useTheme } from "@components/theme/theme-provider";

// In a real app, you would use a library like react-native-svg or a WebView with a graphing library
// This is a placeholder component

interface GraphViewProps {
  equation: string;
  height?: number;
  showGrid?: boolean;
  showAxes?: boolean;
}

const GraphView: React.FC<GraphViewProps> = ({
  equation,
  height = 200,
  showGrid = true,
  showAxes = true,
}) => {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get("window").width - 32; // Accounting for padding

  return (
    <Card variant="outlined">
      <View
        style={{
          height,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Graph for: {equation}</Text>
        <Text variant="body-sm" color={colors.secondaryText}>
          {showGrid ? "Grid enabled" : "Grid disabled"} •{" "}
          {showAxes ? "Axes enabled" : "Axes disabled"}
        </Text>
      </View>
    </Card>
  );
};

export default GraphView;
