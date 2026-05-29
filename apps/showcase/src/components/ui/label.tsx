import { THEME, useTheme } from "@/lib/theme";
import Typography from "@/components/ui/typography";
import { forwardRef } from "react";
import { Text, type TextProps, type StyleProp, type TextStyle } from "react-native";
type LabelProps = {
    required?: boolean;
    disabled?: boolean;
    style?: StyleProp<TextStyle>;
} & TextProps;
export const Label = forwardRef<Text, LabelProps>(({ children, required = false, disabled = false, style, accessibilityLabel, ...rest }, ref) => {
    const { theme } = useTheme();
    const { colors, spacing } = THEME[theme];
    const requiredPhrase = required ? "Required field" : "";
    const disabledPhrase = disabled ? "Disabled" : "";
    const combinedStateText = [requiredPhrase, disabledPhrase]
        .filter(Boolean)
        .join(", ");
    const baseText = typeof children === "string" ? children : "";
    const resolvedA11yLabel = accessibilityLabel ??
        (combinedStateText ? `${baseText}, ${combinedStateText}` : undefined);
    return (<Typography ref={ref} variant="label" accessibilityRole="text" accessibilityLabel={resolvedA11yLabel} accessibilityState={{ disabled }} {...rest} style={[
            {
                color: colors.foreground,
                marginBottom: spacing.xs,
            },
            disabled && { opacity: 0.5 },
            style,
        ]}>
        {children}
        {required && (<Text style={{ color: colors.destructive }} importantForAccessibility="no" accessibilityElementsHidden>
            {" *"}
          </Text>)}
      </Typography>);
});
Label.displayName = "Label";
export default Label;