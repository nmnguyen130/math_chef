import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@components/ui";
import { useTheme } from "@components/theme/theme-provider";
import { Feather } from "@expo/vector-icons";

interface MathKeyboardProps {
  onKeyPress: (key: string) => void;
}

interface Key {
  label: string;
  value: string;
  color?: string;
  isIcon?: boolean;
}

const MathKeyboard: React.FC<MathKeyboardProps> = ({ onKeyPress }) => {
  const { colors, isDarkMode } = useTheme();

  const keys: Key[][] = [
    [
      { label: "7", value: "7" },
      { label: "8", value: "8" },
      { label: "9", value: "9" },
      { label: "(", value: "(", color: colors.secondary },
      { label: ")", value: ")", color: colors.secondary },
    ],
    [
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6", value: "6" },
      { label: "+", value: "+", color: colors.secondary },
      { label: "-", value: "-", color: colors.secondary },
    ],
    [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "×", value: "*", color: colors.secondary },
      { label: "÷", value: "/", color: colors.secondary },
    ],
    [
      { label: "0", value: "0" },
      { label: ".", value: "." },
      { label: "=", value: "=", color: colors.secondary },
      { label: "x", value: "x", color: colors.primary },
      { label: "y", value: "y", color: colors.primary },
    ],
    [
      { label: "x²", value: "x^2", color: colors.accent },
      { label: "√", value: "sqrt(", color: colors.accent },
      { label: "π", value: "pi", color: colors.accent },
      { label: "^", value: "^", color: colors.accent },
      { label: "⌫", value: "backspace", isIcon: true },
    ],
  ];

  return (
    <View
      className={`rounded-xl overflow-hidden border ${
        isDarkMode ? "border-neutral-700" : "border-neutral-200"
      }`}
    >
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row">
          {row.map((key, keyIndex) => (
            <TouchableOpacity
              key={keyIndex}
              className={`flex-1 h-14 items-center justify-center border-r border-b ${
                isDarkMode ? "border-neutral-700" : "border-neutral-200"
              } ${rowIndex === keys.length - 1 ? "border-b-0" : ""} ${
                keyIndex === row.length - 1 ? "border-r-0" : ""
              }`}
              onPress={() => onKeyPress(key.value)}
            >
              {key.isIcon ? (
                <Feather name="delete" size={24} color={colors.error} />
              ) : (
                <Text weight="medium" color={key.color || colors.text}>
                  {key.label}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default MathKeyboard;
