import { THEME, useTheme } from "@/lib/theme";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import * as React from "react";
import { StyleSheet, type ViewStyle } from "react-native";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ style, ...props }, ref) => {
  const { theme } = useTheme();
  const { spacing } = THEME[theme];

  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      style={StyleSheet.flatten([
        {
          gap: spacing.md,
        },
        style,
      ])}
      {...props}
    />
  );
});

RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ style, disabled, ...props }, ref) => {
  const { theme } = useTheme();
  const { colors } = THEME[theme];

  const baseStyle: ViewStyle = {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      disabled={disabled}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={
        typeof style === "function"
          ? (state) =>
              StyleSheet.flatten([baseStyle, style(state)])
          : StyleSheet.flatten([baseStyle, style])
      }
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        style={StyleSheet.flatten([
          {
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: colors.primary,
          },
        ])}
      />
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };