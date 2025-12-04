import { Stack } from "expo-router";
import React from "react";
import { ReportsProvider } from "./context/ReportsContext"; 
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ReportsProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ReportsProvider>
    </ThemeProvider>
  );
}
