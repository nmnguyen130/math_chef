import React from "react";
import {
  View,
  TouchableOpacity,
  type ViewProps,
  type ViewStyle,
  type TouchableOpacityProps,
} from "react-native";
import { useTheme } from "@components/theme/theme-provider";
import { BorderRadius, Shadows } from "@constants/theme";

type CardVariant = "elevated" | "outlined" | "filled";

interface CardProps extends ViewProps {
  variant?: CardVariant;
  onPress?: TouchableOpacityProps["onPress"];
  activeOpacity?: number;
}

const Card: React.FC<CardProps> = ({
  variant = "elevated",
  onPress,
  activeOpacity = 0.7,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.xl,
      padding: 16,
    };

    switch (variant) {
      case "elevated":
        return {
          ...baseStyle,
          backgroundColor: colors.card,
          ...Shadows.md,
        };
      case "outlined":
        return {
          ...baseStyle,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: colors.highlight,
        };
      default:
        return baseStyle;
    }
  };

  const cardStyle = [getCardStyle(), style] as ViewStyle[];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={cardStyle}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

export const CardHeader: React.FC<ViewProps> = ({
  style,
  children,
  ...props
}) => (
  <View style={[{ marginBottom: 8 }, style]} {...props}>
    {children}
  </View>
);

export const CardContent: React.FC<ViewProps> = ({
  style,
  children,
  ...props
}) => (
  <View style={style} {...props}>
    {children}
  </View>
);

export const CardFooter: React.FC<ViewProps> = ({
  style,
  children,
  ...props
}) => (
  <View style={[{ marginTop: 8 }, style]} {...props}>
    {children}
  </View>
);

export default Card;
