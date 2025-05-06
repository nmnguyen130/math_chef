import React from "react";
import { View } from "react-native";
import { Card, Icon, Text } from "@components/ui";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@components/theme/theme-provider";
import { BorderRadius } from "@constants/theme";

interface PracticeCardProps {
  equation: string;
  type: string;
  index: number;
  isCompleted?: boolean;
  difficulty?: "Easy" | "Medium" | "Hard";
  isFavorite?: boolean;
  onPress?: () => void;
}

const PracticeCard: React.FC<PracticeCardProps> = ({
  equation,
  type,
  index,
  isCompleted = false,
  difficulty = "Medium",
  isFavorite = false,
  onPress,
}) => {
  const { colors, isDarkMode } = useTheme();

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "Easy":
        return colors.accent;
      case "Medium":
        return colors.secondary;
      case "Hard":
        return colors.error;
      default:
        return colors.secondary;
    }
  };

  return (
    <Card
      variant="outlined"
      onPress={onPress}
      className={`mb-3 p-4 rounded-xl border ${
        isDarkMode ? "border-neutral-800" : "border-neutral-200"
      } ${
        isCompleted ? (isDarkMode ? "bg-neutral-900" : "bg-neutral-50") : ""
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text weight="medium">
              {index + 1}. {equation}
            </Text>
            {isFavorite && (
              <View className="ml-2">
                <Feather name="star" size={16} color="#f59e0b" fill="#f59e0b" />
              </View>
            )}
          </View>

          <View className="flex-row items-center">
            <Text
              variant="body-sm"
              color={isCompleted ? colors.success : undefined}
              className="mr-3"
            >
              {type}
            </Text>

            <View
              className="px-2 py-0.5 rounded"
              style={{
                backgroundColor:
                  getDifficultyColor() + (isDarkMode ? "30" : "20"),
              }}
            >
              <Text variant="caption" color={getDifficultyColor()}>
                {difficulty}
              </Text>
            </View>

            {isCompleted && (
              <View className="flex-row items-center ml-3">
                <View className="mr-1">
                  <Feather
                    name="clock"
                    size={12}
                    color={colors.secondaryText}
                  />
                </View>
                <Text variant="caption" color={colors.secondaryText}>
                  2d ago
                </Text>
              </View>
            )}
          </View>
        </View>

        <Icon>
          {isCompleted ? (
            <Feather
              name="check-circle"
              color={colors.success}
              fill={colors.success}
            />
          ) : (
            <Feather name="file-text" color={colors.secondaryText} />
          )}
        </Icon>
      </View>
    </Card>
  );
};

export default PracticeCard;
