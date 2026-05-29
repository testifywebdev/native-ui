import { THEME, useTheme } from "@/lib/theme";
import * as React from "react";
import { Platform, TextInput, type TextInputProps, type ViewStyle, type TextStyle } from "react-native";
export interface TextareaProps extends TextInputProps {
    "aria-invalid"?: boolean;
}
const Textarea = React.forwardRef<TextInput, TextareaProps>(({ style, "aria-invalid": ariaInvalid, editable = true, onFocus, onBlur, ...props }, ref) => {
    const { theme } = useTheme();
    const { colors, radius, typography } = THEME[theme];
    const [isFocused, setIsFocused] = React.useState(false);
    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };
    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };
    let borderColor = colors.border;
    if (ariaInvalid) {
        borderColor = colors.destructive;
    }
    else if (isFocused) {
        borderColor = colors.ring;
    }
    return (<TextInput ref={ref} multiline textAlignVertical="top" editable={editable} placeholderTextColor={colors.mutedForeground} onFocus={handleFocus} onBlur={handleBlur} style={[
            {
                minHeight: 64,
                width: "100%",
                borderRadius: radius.lg,
                borderWidth: 1,
                borderColor,
                backgroundColor: !editable
                    ? (theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")
                    : "transparent",
                paddingHorizontal: 10,
                paddingVertical: 8,
                fontSize: typography.base,
                color: colors.foreground,
                opacity: editable ? 1 : 0.5,
            },
            Platform.OS === "web" && { outlineStyle: "none" } as any,
            style,
        ]} {...props}/>);
});
Textarea.displayName = "Textarea";
export { Textarea };