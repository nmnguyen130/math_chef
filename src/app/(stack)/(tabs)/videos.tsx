import { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "@components/theme/theme-provider";
import { Text, VideoCard, Input } from "@components/ui";
import { Feather } from "@expo/vector-icons";

const VideosScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Algebra",
    "Calculus",
    "Geometry",
    "Trigonometry",
    "Statistics",
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const videos = [
    {
      title: "Algebra Tutorial- Quadratic Equation",
      source: "YouTube",
      thumbnail: { uri: "/placeholder.svg?height=120&width=200" },
      duration: "10:25",
      views: "1.2M",
      category: "Algebra",
    },
    {
      title:
        "Quadratic Equation | Easy Tutorial for Beginners | Solve Equation",
      source: "YouTube",
      thumbnail: { uri: "/placeholder.svg?height=120&width=200" },
      duration: "15:30",
      views: "856K",
      category: "Algebra",
    },
    {
      title: "Understanding Trigonometric Functions",
      source: "YouTube",
      thumbnail: { uri: "/placeholder.svg?height=120&width=200" },
      duration: "8:45",
      views: "543K",
      category: "Trigonometry",
    },
    {
      title: "Calculus Basics - Derivatives and Integrals",
      source: "YouTube",
      thumbnail: { uri: "/placeholder.svg?height=120&width=200" },
      duration: "20:15",
      views: "1.5M",
      category: "Calculus",
    },
    {
      title: "Geometry Fundamentals - Angles and Shapes",
      source: "YouTube",
      thumbnail: { uri: "/placeholder.svg?height=120&width=200" },
      duration: "12:30",
      views: "678K",
      category: "Geometry",
    },
    {
      title: "Statistics Made Easy - Mean, Median, Mode",
      source: "YouTube",
      thumbnail: { uri: "/placeholder.svg?height=120&width=200" },
      duration: "14:20",
      views: "432K",
      category: "Statistics",
    },
  ];

  const filteredVideos = videos.filter(
    (video) =>
      (activeCategory === "All" || video.category === activeCategory) &&
      (searchQuery === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const styles = StyleSheet.create({
    activeCategoryButton: {
      backgroundColor: isDarkMode
        ? `${colors.primary}30`
        : `${colors.primary}10`,
    },
    inactiveCategoryButton: {
      backgroundColor: isDarkMode ? colors.highlight : "#f5f5f5",
    },
  });

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className="p-4">
        {/* Search Bar */}
        <View className="mb-1">
          <Input
            placeholder="Search tutorials..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={
              <Feather name="search" size={20} color={colors.secondaryText} />
            }
            rightIcon={
              <Feather name="filter" size={20} color={colors.secondaryText} />
            }
            variant="filled"
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ flexDirection: "row" }}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              className="mr-2 px-4 py-2 rounded-full"
              style={
                activeCategory === category
                  ? styles.activeCategoryButton
                  : styles.inactiveCategoryButton
              }
              onPress={() => setActiveCategory(category)}
            >
              <Text
                color={
                  activeCategory === category
                    ? colors.primary
                    : colors.secondaryText
                }
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Video */}
        {activeCategory === "All" && searchQuery === "" && (
          <View className="mb-4">
            <Text variant="h3" className="mb-4">
              Featured
            </Text>
            <TouchableOpacity>
              <Image
                source={{ uri: "/placeholder.svg?height=200&width=400" }}
                className="w-full h-48 rounded-xl"
                resizeMode="cover"
              />
              <View
                className="absolute bottom-0 left-0 right-0 p-3"
                style={{
                  backgroundColor: isDarkMode
                    ? "rgba(0,0,0,0.7)"
                    : "rgba(255,255,255,0.7)",
                }}
              >
                <Text weight="semibold">Master Algebra in 30 Minutes</Text>
                <View className="flex-row justify-between mt-1">
                  <Text variant="body-sm" color={colors.secondaryText}>
                    30:45 • 2.5M views
                  </Text>
                  <Text variant="body-sm" color={colors.primary}>
                    Premium
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Video List */}
        <View>
          <Text variant="h3" className="mb-4">
            {activeCategory === "All"
              ? "All Videos"
              : activeCategory + " Videos"}
          </Text>

          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <VideoCard
                key={index}
                title={video.title}
                source={`${video.source} • ${video.views} views`}
                thumbnail={video.thumbnail}
                duration={video.duration}
                category={video.category}
                onPress={() => {}}
              />
            ))
          ) : (
            <View className="flex items-center justify-center py-8">
              <Text>No videos found for "{searchQuery}"</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default VideosScreen;
