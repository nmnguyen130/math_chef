import React from "react";
import { View, Image, type ImageSourcePropType } from "react-native";
import Card from "./card";
import Text from "./text";
import Icon from "./icon";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@components/theme/theme-provider";
import { BorderRadius } from "@constants/theme";

interface VideoCardProps {
  title: string;
  source: string;
  thumbnail: ImageSourcePropType;
  duration?: string;
  category?: string;
  onPress?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  source,
  thumbnail,
  duration,
  category,
  onPress,
}) => {
  const { colors, isDarkMode } = useTheme();

  const getCategoryColor = () => {
    switch (category) {
      case "Algebra":
        return colors.primary;
      case "Calculus":
        return colors.secondary;
      case "Geometry":
        return colors.accent;
      case "Trigonometry":
        return colors.warning;
      case "Statistics":
        return colors.info;
      default:
        return colors.primary;
    }
  };

  return (
    <Card
      variant="outlined"
      onPress={onPress}
      className={`mb-4 rounded-xl overflow-hidden border ${
        isDarkMode ? "border-neutral-800" : "border-neutral-200"
      }`}
    >
      <View className="relative">
        <Image source={thumbnail} className="w-full h-48" resizeMode="cover" />

        {/* Play button overlay */}
        <View className="absolute inset-0 items-center justify-center">
          <View className="bg-black/50 rounded-full p-3">
            <Feather name="play" size={24} color="#fff" fill="#fff" />
          </View>
        </View>

        {/* Duration badge */}
        {duration && (
          <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded">
            <Text variant="caption" color="#fff">
              {duration}
            </Text>
          </View>
        )}

        {/* Category badge */}
        {category && (
          <View
            className="absolute top-2 left-2 px-2 py-1 rounded"
            style={{ backgroundColor: getCategoryColor() }}
          >
            <Text variant="caption" color="#fff">
              {category}
            </Text>
          </View>
        )}
      </View>

      <View className="p-3">
        <Text weight="medium" numberOfLines={2}>
          {title}
        </Text>
        <Text variant="body-sm" color={colors.secondaryText} className="mt-1">
          {source}
        </Text>
      </View>
    </Card>
  );
};

export default VideoCard;
