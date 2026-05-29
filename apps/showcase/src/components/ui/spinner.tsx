import { THEME, useTheme } from "@/lib/theme";
import { forwardRef, useEffect } from "react";
import { View, type ViewProps, type ViewStyle, type StyleProp } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, } from "react-native-reanimated";
type SpinnerSize = "sm" | "default" | "lg" | number;
type SpinnerProps = {
    size?: SpinnerSize;
    color?: string;
    thickness?: number;
    style?: StyleProp<ViewStyle>;
} & Omit<ViewProps, "style">;
const getSize = (size: SpinnerSize, spacing: any): number => {
    if (typeof size === "number")
        return size;
    switch (size) {
        case "sm":
            return spacing.lg;
        case "lg":
            return spacing.xl * 2;
        case "default":
        default:
            return spacing.xl;
    }
};
const Spinner = forwardRef<View, SpinnerProps>(({ size = "default", color, thickness, accessibilityLabel = "Loading...", style, ...rest }, ref) => {
    const { theme } = useTheme();
    const { colors, spacing } = THEME[theme];
    const resolvedSize = getSize(size, spacing);
    const resolvedThickness = thickness ?? Math.max(2, resolvedSize * 0.1);
    const resolvedColor = color ?? colors.primary;
    const rotation = useSharedValue(0);
    useEffect(() => {
        rotation.value = withRepeat(withTiming(360, {
            duration: 800,
            easing: Easing.linear,
        }), -1, false);
    }, [rotation]);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));
    const spinnerStyle: ViewStyle = {
        width: resolvedSize,
        height: resolvedSize,
        borderRadius: resolvedSize / 2,
        borderWidth: resolvedThickness,
        borderColor: colors.border,
        borderTopColor: resolvedColor,
        borderRightColor: resolvedColor,
    };
    return (<Animated.View ref={ref} accessibilityRole="progressbar" accessibilityLabel={accessibilityLabel} accessibilityState={{ busy: true }} {...rest} style={[spinnerStyle, animatedStyle, style]}/>);
});
Spinner.displayName = "Spinner";
export default Spinner;