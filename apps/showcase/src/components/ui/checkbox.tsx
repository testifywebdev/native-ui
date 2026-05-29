import { THEME, useTheme } from "@/lib/theme";
import { forwardRef, useEffect } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Pressable, StyleSheet, type PressableProps, type View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming, } from "react-native-reanimated";
type CheckboxProps = {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
} & Omit<PressableProps, "style" | "onPress">;
const CHECKBOX_SIZE = 24;
export const Checkbox = forwardRef<View, CheckboxProps>(({ checked = false, onCheckedChange, disabled = false, accessibilityLabel, accessibilityHint, ...rest }, ref) => {
    const { theme } = useTheme();
    const { colors, radius } = THEME[theme];
    const progress = useSharedValue(checked ? 1 : 0);
    useEffect(() => {
        progress.value = withTiming(checked ? 1 : 0, { duration: 150 });
    }, [checked, progress]);
    const boxAnimatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(progress.value, [0, 1], ["transparent", colors.primary]),
            borderColor: interpolateColor(progress.value, [0, 1], [colors.input, colors.primary]),
        };
    });
    const checkIconAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: progress.value,
            transform: [
                { scale: withSpring(checked ? 1 : 0, { mass: 0.5, damping: 12 }) }
            ],
        };
    });
    const handlePress = () => {
        if (disabled)
            return;
        onCheckedChange?.(!checked);
    };
    return (<Pressable ref={ref} onPress={handlePress} disabled={disabled} accessibilityRole="checkbox" accessibilityState={{ checked, disabled }} accessibilityLabel={accessibilityLabel ?? "Checkbox"} accessibilityHint={accessibilityHint ?? "Toggles the checkbox state"} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} {...rest} style={[
            styles.container,
            {
                borderRadius: radius.sm,
                opacity: disabled ? 0.5 : 1,
            },
        ]}>
        <Animated.View style={[
            StyleSheet.absoluteFillObject,
            styles.animatedBox,
            { borderRadius: radius.sm },
            boxAnimatedStyle,
        ]}/>
        <Animated.View style={checkIconAnimatedStyle}>
          <AntDesign name="check" size={16} color={colors.primaryForeground} strokeWidth={3} importantForAccessibility="no" accessibilityElementsHidden/>
        </Animated.View>
      </Pressable>);
});
const styles = StyleSheet.create({
    container: {
        width: CHECKBOX_SIZE,
        height: CHECKBOX_SIZE,
        justifyContent: "center",
        alignItems: "center",
    },
    animatedBox: {
        borderWidth: 2,
    },
});
Checkbox.displayName = "Checkbox";
export default Checkbox;