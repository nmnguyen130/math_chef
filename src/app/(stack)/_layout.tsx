import React from "react";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="solve/[type]"
        options={{
          title: `Solve`,
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen name="draw" options={{ title: "Draw Equation" }} />
    </Stack>
  );
};

export default StackLayout;
