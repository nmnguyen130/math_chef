import React from "react";
import {
  Text as RNText,
  type TextStyle,
  type TextProps as RNTextProps,
} from "react-native";
import { useTheme } from "@components/theme/theme-provider";
import { Typography } from "@constants/theme";

type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "body-sm"
  | "caption"
  | "math";
type FontWeight = "normal" | "medium" | "semibold" | "bold";

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: FontWeight;
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
}

const Text: React.FC<TextProps> = ({
  variant = "body",
  weight = "normal",
  color,
  align = "auto",
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case "h1":
        return {
          fontSize: Typography.fontSizes["3xl"],
          lineHeight:
            Typography.fontSizes["3xl"] * Typography.lineHeights.tight,
          fontWeight: Typography.fontWeights.bold,
        };
      case "h2":
        return {
          fontSize: Typography.fontSizes["2xl"],
          lineHeight:
            Typography.fontSizes["2xl"] * Typography.lineHeights.tight,
          fontWeight: Typography.fontWeights.bold,
        };
      case "h3":
        return {
          fontSize: Typography.fontSizes.xl,
          lineHeight: Typography.fontSizes.xl * Typography.lineHeights.tight,
          fontWeight: Typography.fontWeights.semibold,
        };
      case "h4":
        return {
          fontSize: Typography.fontSizes.lg,
          lineHeight: Typography.fontSizes.lg * Typography.lineHeights.tight,
          fontWeight: Typography.fontWeights.semibold,
        };
      case "body":
        return {
          fontSize: Typography.fontSizes.md,
          lineHeight: Typography.fontSizes.md * Typography.lineHeights.normal,
        };
      case "body-sm":
        return {
          fontSize: Typography.fontSizes.sm,
          lineHeight: Typography.fontSizes.sm * Typography.lineHeights.normal,
        };
      case "caption":
        return {
          fontSize: Typography.fontSizes.xs,
          lineHeight: Typography.fontSizes.xs * Typography.lineHeights.normal,
        };
      case "math":
        return {
          fontSize: Typography.fontSizes.lg,
          lineHeight: Typography.fontSizes.lg * Typography.lineHeights.normal,
          fontFamily: "System", // Ideally use a math-friendly font
        };
      default:
        return {
          fontSize: Typography.fontSizes.md,
          lineHeight: Typography.fontSizes.md * Typography.lineHeights.normal,
        };
    }
  };

  const getWeightStyle = (): TextStyle => {
    switch (weight) {
      case "normal":
        return { fontWeight: Typography.fontWeights.normal };
      case "medium":
        return { fontWeight: Typography.fontWeights.medium };
      case "semibold":
        return { fontWeight: Typography.fontWeights.semibold };
      case "bold":
        return { fontWeight: Typography.fontWeights.bold };
      default:
        return { fontWeight: Typography.fontWeights.normal };
    }
  };

  const getAlignStyle = (): TextStyle => {
    return { textAlign: align };
  };

  const textStyle: TextStyle = {
    ...getVariantStyle(),
    ...getWeightStyle(),
    ...getAlignStyle(),
    color: color || colors.text,
  };

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

export default Text;
