import React from "react";
import { useRef, useState } from "react";
import { View, PanResponder, Animated, StyleSheet } from "react-native";
import { useTheme } from "@components/theme/theme-provider";
import { BorderRadius } from "@constants/theme";

interface Point {
  x: number;
  y: number;
}

interface Path {
  points: Point[];
  color: string;
  width: number;
}

interface DrawingCanvasProps {
  strokeColor?: string;
  strokeWidth?: number;
  onPathsChange?: (paths: Path[]) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  strokeColor = "#000000",
  strokeWidth = 3,
  onPathsChange,
}) => {
  const { colors } = useTheme();
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        setCurrentPath([...currentPath, { x: locationX, y: locationY }]);
      },
      onPanResponderRelease: () => {
        if (currentPath.length > 1) {
          const newPath: Path = {
            points: currentPath,
            color: strokeColor,
            width: strokeWidth,
          };
          const newPaths = [...paths, newPath];
          setPaths(newPaths);
          if (onPathsChange) {
            onPathsChange(newPaths);
          }
        }
        setCurrentPath([]);
      },
    })
  ).current;

  const renderPath = (path: Path, index: number) => {
    if (path.points.length < 2) return null;

    const pathString = path.points
      .map((point, i) => {
        return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
      })
      .join(" ");

    return (
      <Animated.View key={index} style={StyleSheet.absoluteFill}>
        <svg height="100%" width="100%">
          <path
            d={pathString}
            stroke={path.color}
            strokeWidth={path.width}
            fill="none"
          />
        </svg>
      </Animated.View>
    );
  };

  const renderCurrentPath = () => {
    if (currentPath.length < 2) return null;

    const pathString = currentPath
      .map((point, i) => {
        return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
      })
      .join(" ");

    return (
      <Animated.View style={StyleSheet.absoluteFill}>
        <svg height="100%" width="100%">
          <path
            d={pathString}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </svg>
      </Animated.View>
    );
  };

  const clearCanvas = () => {
    setPaths([]);
    if (onPathsChange) {
      onPathsChange([]);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.highlight,
        borderRadius: BorderRadius.lg,
      }}
      {...panResponder.panHandlers}
    >
      {paths.map(renderPath)}
      {renderCurrentPath()}
    </View>
  );
};

export default DrawingCanvas;
