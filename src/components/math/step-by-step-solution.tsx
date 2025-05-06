import React from "react";
import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, Card, Icon } from "@components/ui";
import { Feather } from "@expo/vector-icons";
import MathEquation from "./math-equation";
import { useTheme } from "@components/theme/theme-provider";

interface Step {
  explanation: string;
  equation: string;
}

interface StepByStepSolutionProps {
  steps: Step[];
  initialExpandedSteps?: number[];
}

const StepByStepSolution: React.FC<StepByStepSolutionProps> = ({
  steps,
  initialExpandedSteps = [0],
}) => {
  const [expandedSteps, setExpandedSteps] =
    useState<number[]>(initialExpandedSteps);
  const { colors, isDarkMode } = useTheme();

  const toggleStep = (index: number) => {
    if (expandedSteps.includes(index)) {
      setExpandedSteps(expandedSteps.filter((i) => i !== index));
    } else {
      setExpandedSteps([...expandedSteps, index]);
    }
  };

  const expandAll = () => {
    setExpandedSteps(steps.map((_, index) => index));
  };

  const collapseAll = () => {
    setExpandedSteps([]);
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 8,
        }}
      >
        <TouchableOpacity onPress={expandAll} style={{ marginRight: 16 }}>
          <Text color={colors.primary}>Expand All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={collapseAll}>
          <Text color={colors.primary}>Collapse All</Text>
        </TouchableOpacity>
      </View>

      {steps.map((step, index) => (
        <Card key={index} variant="outlined" style={{ marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => toggleStep(index)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 12,
            }}
          >
            <Text weight="medium">Step {index + 1}</Text>
            <Icon>
              {expandedSteps.includes(index) ? (
                <Feather name="chevron-up" />
              ) : (
                <Feather name="chevron-down" />
              )}
            </Icon>
          </TouchableOpacity>

          {expandedSteps.includes(index) && (
            <View style={{ padding: 12, paddingTop: 0 }}>
              <Text style={{ marginBottom: 8 }}>{step.explanation}</Text>
              <MathEquation equation={step.equation} size="sm" />
            </View>
          )}
        </Card>
      ))}
    </View>
  );
};

export default StepByStepSolution;
