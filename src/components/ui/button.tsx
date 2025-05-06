import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@components/theme/theme-provider";
import { BorderRadius, Typography } from "@constants/theme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  children,
  style,
  ...props
}) => {
  const { colors, isDarkMode } = useTheme();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case "secondary":
        return {
          backgroundColor: colors.highlight,
          borderColor: colors.highlight,
          borderWidth: 1,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderColor: "transparent",
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
        };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "sm":
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: BorderRadius.md,
        };
      case "md":
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: BorderRadius.lg,
        };
      case "lg":
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: BorderRadius.xl,
        };
      default:
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: BorderRadius.lg,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize:
        size === "sm"
          ? Typography.fontSizes.sm
          : size === "lg"
          ? Typography.fontSizes.lg
          : Typography.fontSizes.md,
      fontWeight: Typography.fontWeights.medium,
      textAlign: "center",
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          color: "white",
        };
      case "secondary":
        return {
          ...baseStyle,
          color: isDarkMode ? "white" : "black",
        };
      case "outline":
      case "ghost":
        return {
          ...baseStyle,
          color: colors.primary,
        };
      default:
        return {
          ...baseStyle,
          color: "white",
        };
    }
  };

  const buttonStyles = [
    getVariantStyle(),
    getSizeStyle(),
    {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      opacity: isDisabled ? 0.5 : 1,
      width: fullWidth ? "100%" : "auto",
    },
    style,
  ] as ViewStyle[];

  const textStyle = getTextStyle();

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={isDisabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "white" : colors.primary}
        />
      ) : (
        <>
          {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
          {typeof children === "string" ? (
            <Text style={textStyle}>{children}</Text>
          ) : (
            children
          )}
          {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
