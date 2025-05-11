import React from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import KaTeXInline from "./katex_inline";
import Card from "../ui/card";

type CardVariant = "elevated" | "outlined" | "filled";

export interface MathEquationProps {
  equation: string;
  size?: "sm" | "md" | "lg";
  bordered?: boolean;
  withText?: boolean;
  displayMode?: boolean;
  /** Variant of the card (only applies when bordered is true) */
  cardVariant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const MathEquation: React.FC<MathEquationProps> = ({
  equation,
  size = "md",
  bordered = false,
  withText = false,
  displayMode = false,
  cardVariant = "outlined",
  style,
  containerStyle,
}) => {
  const getFontSize = () => {
    switch (size) {
      case "sm":
        return 12;
      case "md":
        return 16;
      case "lg":
        return 20;
      default:
        return 16;
    }
  };

  const fontSize = getFontSize();
  const formatEquation = (eq: string, isDisplayMode: boolean) => {
    // If withText is true, return equation as-is without any delimiters
    if (withText) return eq;

    // For non-withText mode, check if already wrapped in delimiters
    if (eq.startsWith("\\[") && eq.endsWith("\\]")) return eq;
    if (eq.startsWith("\\(") && eq.endsWith("\\)")) return eq;
    if (eq.startsWith("$") && eq.endsWith("$")) return eq;

    // Wrap in appropriate delimiters based on display mode
    return isDisplayMode ? `\\[ ${eq} \\]` : `\\( ${eq} \\)`;
  };

  const equationContent = (
    <View style={[styles.container, displayMode && styles.displayMode, style]}>
      <KaTeXInline
        expression={formatEquation(equation, displayMode)}
        fontSize={fontSize}
      />
    </View>
  );

  if (bordered) {
    return (
      <Card variant={cardVariant} style={[styles.card, containerStyle]}>
        {equationContent}
      </Card>
    );
  }

  return equationContent;
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  displayMode: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
  },
});

export default MathEquation;
