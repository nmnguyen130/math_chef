import React from "react";
import { View, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { Card } from "@components/ui";
import { useTheme } from "@components/theme/theme-provider";

interface MathEquationProps {
  equation: string;
  isHighlighted?: boolean;
  showBorder?: boolean;
  size?: "sm" | "md" | "lg";
}

const MathEquation: React.FC<MathEquationProps> = ({
  equation,
  isHighlighted = false,
  showBorder = true,
  size = "md",
}) => {
  const { colors } = useTheme();

  const getFontSize = () => {
    switch (size) {
      case "sm":
        return 20;
      case "md":
        return 24;
      case "lg":
        return 28;
      default:
        return 24;
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>
        body { display: flex; justify-content: center; align-items: center;}
        div { font-size: ${getFontSize()}px; }
      </style>
    </head>
    <body>
      <div>
        \\(${equation}\\)
      </div>
    </body>
    </html>
  `;

  const cardPadding = size === "sm" ? 6 : size === "lg" ? 14 : 10;

  return (
    <Card
      variant={showBorder ? "outlined" : "filled"}
      style={{
        backgroundColor: isHighlighted ? `${colors.primary}20` : colors.card,
        borderColor: isHighlighted ? colors.primary : colors.border,
        padding: cardPadding,
      }}
    >
      <View style={{ width: "100%", height: getFontSize() * 2 }}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={{ backgroundColor: "transparent" }}
          scrollEnabled={false}
        />
      </View>
    </Card>
  );
};

export default MathEquation;
