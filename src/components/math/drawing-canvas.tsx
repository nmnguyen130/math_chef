import React, { useCallback, useEffect } from "react";
import { useRef, useState } from "react";
import { View, PanResponder, StyleSheet } from "react-native";
import Svg, { Path as SvgPath } from "react-native-svg";
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
  paths: Path[];
  setPaths: (value: Path[] | ((prev: Path[]) => Path[])) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  strokeColor = "#000000",
  strokeWidth = 3,
  paths,
  setPaths,
}) => {
  const { colors } = useTheme();
  const currentPointRef = useRef<Point[]>([]);
  const [renderTrigger, setRenderTrigger] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        currentPointRef.current = [{ x: locationX, y: locationY }];
        setRenderTrigger((prev) => !prev);
      },
      onPanResponderMove: (event) => {
        const { locationX, locationY } = event.nativeEvent;
        currentPointRef.current.push({ x: locationX, y: locationY });
        setRenderTrigger((prev) => !prev);
      },
      onPanResponderRelease: () => {
        if (currentPointRef.current.length > 1) {
          const newPath: Path = {
            points: [...currentPointRef.current],
            color: strokeColor,
            width: strokeWidth,
          };
          setPaths((prevPaths) => [...prevPaths, newPath]);
        }
        currentPointRef.current = [];
        setRenderTrigger((prev) => !prev);
      },
    })
  ).current;

  const getPathString = useCallback((points: Point[]) => {
    return points
      .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
  }, []);

  const renderPath = (path: Path, index: number) => {
    if (path.points.length < 2) return null;

    const pathString = getPathString(path.points);

    return (
      <Svg key={index} style={StyleSheet.absoluteFill}>
        <SvgPath
          d={pathString}
          stroke={path.color}
          strokeWidth={path.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  };

  const renderCurrentPath = () => {
    if (currentPointRef.current.length < 2) return null;

    const pathString = getPathString(currentPointRef.current);

    return (
      <Svg style={StyleSheet.absoluteFill}>
        <SvgPath
          d={pathString}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
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
