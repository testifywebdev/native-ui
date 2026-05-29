import { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

export type Theme = "light" | "dark" | "unspecified";

export type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};
export type ThemeSpacing = {
  xs: number;    // 4
  sm: number;    // 8
  md: number;    // 12
  lg: number;    // 16
  xl: number;    // 20
  "2xl": number; // 24
  "3xl": number; // 32
};
export type ThemeRadius = {
  sm: number;   // 4
  md: number;   // 8
  lg: number;   // 12
  xl: number;   // 16
  full: number; // 9999 — pills, avatars
};

export type ThemeTypography = {
  xs: number;    // 11
  sm: number;    // 13
  base: number;  // 15
  lg: number;    // 17
  xl: number;    // 20
  "2xl": number; // 24
};

export type ThemeConfig = {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
};

const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
};

const radius: ThemeRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

const typography: ThemeTypography = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  "2xl": 24,
};
export const THEME: Record<Theme, ThemeConfig> = {
  light: {
    colors: {
      background: "#ffffff",
      foreground: "#09090b",
      card: "#ffffff",
      cardForeground: "#09090b",
      popover: "#ffffff",
      popoverForeground: "#09090b",
      primary: "#18181b",
      primaryForeground: "#fafafa",
      secondary: "#f4f4f5",
      secondaryForeground: "#18181b",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      accent: "#f4f4f5",
      accentForeground: "#18181b",
      destructive: "#e7000b",
      destructiveForeground: "#fafafa",
      border: "#e4e4e7",
      input: "#e4e4e7",
      ring: "#a1a1aa",
      chart1: "#d4d4d8",
      chart2: "#71717a",
      chart3: "#52525b",
      chart4: "#3f3f46",
      chart5: "#27272a",
      sidebar: "#fafafa",
      sidebarForeground: "#09090b",
      sidebarPrimary: "#18181b",
      sidebarPrimaryForeground: "#fafafa",
      sidebarAccent: "#f4f4f5",
      sidebarAccentForeground: "#18181b",
      sidebarBorder: "#e4e4e7",
      sidebarRing: "#a1a1aa",
    },
    spacing,
    radius,
    typography,
  },
  dark: {
    colors: {
      background: "#09090b",
      foreground: "#fafafa",
      card: "#18181b",
      cardForeground: "#fafafa",
      popover: "#18181b",
      popoverForeground: "#fafafa",
      primary: "#e4e4e7",
      primaryForeground: "#18181b",
      secondary: "#27272a",
      secondaryForeground: "#fafafa",
      muted: "#27272a",
      mutedForeground: "#a1a1aa",
      accent: "#27272a",
      accentForeground: "#fafafa",
      destructive: "#ff6467",
      destructiveForeground: "#fafafa",
      border: "rgba(255, 255, 255, 0.1)",
      input: "rgba(255, 255, 255, 0.15)",
      ring: "#71717a",
      chart1: "#d4d4d8",
      chart2: "#71717a",
      chart3: "#52525b",
      chart4: "#3f3f46",
      chart5: "#27272a",
      sidebar: "#18181b",
      sidebarForeground: "#fafafa",
      sidebarPrimary: "#1447e6",
      sidebarPrimaryForeground: "#fafafa",
      sidebarAccent: "#27272a",
      sidebarAccentForeground: "#fafafa",
      sidebarBorder: "rgba(255, 255, 255, 0.1)",
      sidebarRing: "#71717a",
    },
    spacing,
    radius,
    typography,
  },
  unspecified: {
    colors: {
      background: "#ffffff",
      foreground: "#09090b",
      card: "#ffffff",
      cardForeground: "#09090b",
      popover: "#ffffff",
      popoverForeground: "#09090b",
      primary: "#18181b",
      primaryForeground: "#fafafa",
      secondary: "#f4f4f5",
      secondaryForeground: "#18181b",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      accent: "#f4f4f5",
      accentForeground: "#18181b",
      destructive: "#e7000b",
      destructiveForeground: "#fafafa",
      border: "#e4e4e7",
      input: "#e4e4e7",
      ring: "#a1a1aa",
      chart1: "#d4d4d8",
      chart2: "#71717a",
      chart3: "#52525b",
      chart4: "#3f3f46",
      chart5: "#27272a",
      sidebar: "#fafafa",
      sidebarForeground: "#09090b",
      sidebarPrimary: "#18181b",
      sidebarPrimaryForeground: "#fafafa",
      sidebarAccent: "#f4f4f5",
      sidebarAccentForeground: "#18181b",
      sidebarBorder: "#e4e4e7",
      sidebarRing: "#a1a1aa",
    },
    spacing,
    radius,
    typography,
  }
};

type ThemeContextType = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();

  const [theme, setTheme] = useState<Theme>(colorScheme ?? "unspecified");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);