import { THEME, useTheme } from "@/lib/theme";
import { createContext, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState, } from "react";
import { Pressable, Text, TextInput, type TextInputProps, type StyleProp, type TextStyle, type ViewProps, type ViewStyle, View, } from "react-native";
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, } from "react-native-reanimated";
type OTPContextValue = {
    value: string;
    maxLength: number;
    isFocused: boolean;
    activeIndex: number;
    focusInput: () => void;
};
const OTPContext = createContext<OTPContextValue | null>(null);
const useOTP = (): OTPContextValue => {
    const ctx = useContext(OTPContext);
    if (!ctx) {
        throw new Error("InputOTPSlot / InputOTPGroup must be rendered inside <InputOTP>.");
    }
    return ctx;
};
type InputOTPProps = {
    maxLength: number;
    value?: string;
    onChangeText?: (value: string) => void;
    onComplete?: (value: string) => void;
    disabled?: boolean;
    children: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, "value" | "onChangeText" | "maxLength" | "style" | "children" | "caretHidden" | "multiline">;
type InputOTPGroupProps = {
    style?: StyleProp<ViewStyle>;
} & Omit<ViewProps, "style">;
type InputOTPSlotProps = {
    index: number;
    style?: StyleProp<ViewStyle>;
    charStyle?: StyleProp<TextStyle>;
} & Omit<ViewProps, "style">;
type InputOTPSeparatorProps = {
    style?: StyleProp<ViewStyle>;
} & Omit<ViewProps, "style">;
const InputOTP = forwardRef<TextInput, InputOTPProps>(({ maxLength, value: valueProp, onChangeText, onComplete, disabled = false, children, containerStyle, accessibilityLabel, keyboardType = "number-pad", ...rest }, ref) => {
    const { theme } = useTheme();
    const { spacing } = THEME[theme];
    const inputRef = useRef<TextInput>(null);
    useImperativeHandle(ref, () => inputRef.current as TextInput, []);
    const [internalValue, setInternalValue] = useState("");
    const isControlled = valueProp !== undefined;
    const value = isControlled ? (valueProp ?? "") : internalValue;
    const [isFocused, setIsFocused] = useState(false);
    const activeIndex = Math.min(value.length, maxLength - 1);
    const handleChange = useCallback((text: string) => {
        const next = text.slice(0, maxLength);
        if (!isControlled)
            setInternalValue(next);
        onChangeText?.(next);
        if (next.length === maxLength)
            onComplete?.(next);
    }, [isControlled, maxLength, onChangeText, onComplete]);
    const focusInput = useCallback(() => {
        if (!disabled) {
            inputRef.current?.blur();
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [disabled]);
    return (<OTPContext.Provider value={{ value, maxLength, isFocused, activeIndex, focusInput }}>
        <Pressable onPress={focusInput} disabled={disabled} style={[
            {
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.sm,
                opacity: disabled ? 0.5 : 1,
            },
            containerStyle,
        ]} accessibilityRole="none" accessibilityLabel={accessibilityLabel ??
            `One-time password, ${value.length} of ${maxLength} digits entered`} accessibilityState={{ disabled }} importantForAccessibility="yes">
          
          <TextInput ref={inputRef} value={value} onChangeText={handleChange} maxLength={maxLength} keyboardType={keyboardType} textContentType="oneTimeCode" autoComplete="one-time-code" caretHidden editable={!disabled} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
        }} importantForAccessibility="no" accessibilityElementsHidden {...rest}/>

          {children}
        </Pressable>
      </OTPContext.Provider>);
});
InputOTP.displayName = "InputOTP";
const InputOTPGroup = forwardRef<View, InputOTPGroupProps>(({ children, style, ...rest }, ref) => {
    const { theme } = useTheme();
    const { spacing } = THEME[theme];
    return (<View ref={ref} importantForAccessibility="no" {...rest} style={[
            { flexDirection: "row", alignItems: "center", gap: spacing.xs + 2 },
            style,
        ]}>
        {children}
      </View>);
});
InputOTPGroup.displayName = "InputOTPGroup";
const SLOT_SIZE = 48;
const BLINK_ON_MS = 530;
const BLINK_OFF_MS = 430;
const BLINK_FADE_MS = 80;
const InputOTPSlot = forwardRef<View, InputOTPSlotProps>(({ index, style, charStyle, ...rest }, ref) => {
    const { theme } = useTheme();
    const { colors, radius, typography } = THEME[theme];
    const { value, isFocused, activeIndex } = useOTP();
    const char = value[index] ?? null;
    const isActive = isFocused && index === activeIndex;
    const showCursor = isActive && char === null;
    const cursorOpacity = useSharedValue(0);
    useEffect(() => {
        if (showCursor) {
            cursorOpacity.value = withRepeat(withSequence(withTiming(1, { duration: 0 }), withTiming(1, { duration: BLINK_ON_MS }), withTiming(0, { duration: BLINK_FADE_MS }), withTiming(0, { duration: BLINK_OFF_MS })), -1);
        }
        else {
            cancelAnimation(cursorOpacity);
            cursorOpacity.value = withTiming(0, { duration: 150 });
        }
    }, [showCursor]);
    const animatedCursor = useAnimatedStyle(() => ({
        opacity: cursorOpacity.value,
    }));
    const charScale = useSharedValue(1);
    useEffect(() => {
        if (char !== null) {
            charScale.value = withSequence(withTiming(1.15, { duration: 80 }), withTiming(1, { duration: 100 }));
        }
        else {
            cancelAnimation(charScale);
            charScale.value = 1;
        }
    }, [char]);
    const animatedChar = useAnimatedStyle(() => ({
        opacity: 1,
        transform: [{ scale: charScale.value }],
    }));
    return (<View ref={ref} importantForAccessibility="no" accessibilityElementsHidden {...rest} style={[
            {
                width: SLOT_SIZE,
                height: SLOT_SIZE,
                borderRadius: radius.lg,
                borderWidth: 1.5,
                borderColor: isActive ? colors.ring : colors.border,
                backgroundColor: colors.muted,
                alignItems: "center",
                justifyContent: "center",
            },
            style,
        ]}>
        {char !== null ? (<Animated.View key="char" style={animatedChar}>
            <Text style={[
                {
                    fontSize: typography.lg,
                    fontWeight: "600",
                    color: colors.foreground,
                    letterSpacing: 0,
                },
                charStyle,
            ]}>
              {char}
            </Text>
          </Animated.View>) : (<Animated.View key="cursor" style={[
                {
                    width: 1.5,
                    height: typography.lg,
                    borderRadius: 1,
                    backgroundColor: colors.foreground,
                },
                animatedCursor,
            ]}/>)}
      </View>);
});
InputOTPSlot.displayName = "InputOTPSlot";
const InputOTPSeparator = forwardRef<View, InputOTPSeparatorProps>(({ style, ...rest }, ref) => {
    const { theme } = useTheme();
    const { colors, spacing } = THEME[theme];
    return (<View ref={ref} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden {...rest} style={[
            {
                paddingHorizontal: spacing.xs,
                alignItems: "center",
                justifyContent: "center",
            },
            style,
        ]}>
        <View style={{
            width: spacing.sm,
            height: 1.5,
            borderRadius: 1,
            backgroundColor: colors.mutedForeground,
        }}/>
      </View>);
});
InputOTPSeparator.displayName = "InputOTPSeparator";
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
export type { InputOTPProps, InputOTPGroupProps, InputOTPSlotProps, InputOTPSeparatorProps, };
export const OTP = {
    Root: InputOTP,
    Group: InputOTPGroup,
    Slot: InputOTPSlot,
    Separator: InputOTPSeparator,
};