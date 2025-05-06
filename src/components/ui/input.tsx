import React from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  type TextInputProps,
} from "react-native";
import { useTheme } from "@components/theme/theme-provider";
import Text from "./text";
import { BorderRadius, Typography } from "@constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: "outline" | "filled" | "underlined";
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = "outline",
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const getContainerStyle = () => {
    const baseStyle = {
      width: "100%",
    } as const;

    switch (variant) {
      case "outline":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: error ? colors.error : colors.border,
          borderRadius: BorderRadius.lg,
          backgroundColor: "transparent",
        };
      case "filled":
        return {
          ...baseStyle,
          borderWidth: 0,
          borderRadius: BorderRadius.lg,
          backgroundColor: colors.highlight,
        };
      case "underlined":
        return {
          ...baseStyle,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: error ? colors.error : colors.border,
          borderRadius: 0,
          backgroundColor: "transparent",
        };
      default:
        return baseStyle;
    }
  };

  const inputStyle = {
    flex: 1,
    color: colors.text,
    paddingVertical: 10,
    fontSize: Typography.fontSizes.md,
  };

  return (
    <View style={{ marginBottom: error ? 24 : 16 }}>
      {label && (
        <Text
          style={{
            marginBottom: 4,
            fontSize: Typography.fontSizes.sm,
            color: colors.secondaryText,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          getContainerStyle(),
          {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
          },
        ]}
      >
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}

        <TextInput
          style={[inputStyle, style]}
          placeholderTextColor={colors.secondaryText}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={{ marginLeft: 8 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          style={{
            marginTop: 4,
            fontSize: Typography.fontSizes.sm,
            color: colors.error,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
