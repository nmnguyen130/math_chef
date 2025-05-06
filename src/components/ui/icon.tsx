import React from "react";
import { View, type ViewProps } from "react-native";
import { useTheme } from "@components/theme/theme-provider";
import { LucideProps } from "lucide-react-native";

interface IconProps extends ViewProps {
  size?: number;
  color?: string;
  children: React.ReactNode;
}

const Icon: React.FC<IconProps> = ({
  size = 20,
  color,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();

  // Clone the child element (which should be an icon) and pass the size and color props
  const iconWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<LucideProps>, {
        size, // Set the icon size
        color: color || colors.text, // Set the icon color
      });
    }
    return child;
  });

  return (
    <View
      style={[{ alignItems: "center", justifyContent: "center" }, style]}
      {...props}
    >
      {iconWithProps}
    </View>
  );
};

export default Icon;
