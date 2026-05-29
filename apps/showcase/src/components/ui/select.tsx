import { THEME, useTheme } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import * as SelectPrimitive from "@rn-primitives/select";
import * as React from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

const SelectContext = React.createContext<{
  triggerWidth: number;
  setTriggerWidth: (width: number) => void;
} | null>(null);

const Select = (
  props: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
) => {
  const [triggerWidth, setTriggerWidth] = React.useState(0);

  return (
    <SelectContext.Provider value={{ triggerWidth, setTriggerWidth }}>
      <SelectPrimitive.Root {...props} />
    </SelectContext.Provider>
  );
};

const SelectGroup = SelectPrimitive.Group;

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

const AnimatedView = Platform.OS === "web" ? View : Animated.View;

type Option = SelectPrimitive.Option;

const SelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ style, ...props }, ref) => {
  const { theme } = useTheme();
  const { colors, typography } = THEME[theme];

  return (
    <SelectPrimitive.Value
      ref={ref}
      style={StyleSheet.flatten([
        {
          fontSize: typography.sm,
          color: colors.foreground,
        },
        style as StyleProp<TextStyle>,
      ])}
      {...props}
    />
  );
});

SelectValue.displayName = "SelectValue";
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: "default" | "sm";
  }
>(({ style, children, size = "default", onLayout, ...props }, ref) => {
  const { theme } = useTheme();
  const { colors, radius } = THEME[theme];
  const context = React.useContext(SelectContext);

  // Abstract the inner content to avoid repeating ourselves
  const InnerContent = ({ state }: { state?: any }) => (
    <>
      <View
        style={StyleSheet.flatten([
          {
            flex: 1,
            marginRight: 8,
            flexDirection: "row",
            alignItems: "center",
          },
        ])}
      >
        {typeof children === "function" ? children(state) : children}
      </View>
      <Feather
        name="chevron-down"
        size={16}
        color={colors.mutedForeground}
        aria-hidden={true}
      />
    </>
  );

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      onLayout={(e) => {
        context?.setTriggerWidth(e.nativeEvent.layout.width);
        onLayout?.(e);
      }}
      style={
        Platform.OS === "web"
          ? StyleSheet.flatten([
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.background,
                borderRadius: radius.md,
                paddingHorizontal: 12,
                height: size === "sm" ? 36 : 44,
                opacity: props.disabled ? 0.5 : 1,
                outlineStyle: "none",
              },
              style as any,
            ])
          : ((state : any) =>
              StyleSheet.flatten([
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  borderRadius: radius.md,
                  paddingHorizontal: 12,
                  height: size === "sm" ? 36 : 44,
                  opacity: props.disabled ? 0.5 : 1,
                },
                typeof style === "function" ? style(state) : style,
              ])) as any
      }
      {...props}
    >
      {/* Conditionally pass children based on platform */}
      {Platform.OS === "web" ? <InnerContent /> : (((state: any) => <InnerContent state={state} />) as any)}
    </SelectPrimitive.Trigger>
  );
});

SelectTrigger.displayName = "SelectTrigger";


const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    portalHost?: string;
  }
>(({ style, children, position = "popper", portalHost, ...props }, ref) => {
  const { theme } = useTheme();
  const { colors, radius } = THEME[theme];
  const context = React.useContext(SelectContext);

  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <SelectPrimitive.Overlay
          style={StyleSheet.flatten([
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0, 0, 0, 0.2)" },
          ])}
        >
          <AnimatedView
            entering={Platform.OS !== "web" ? FadeIn.duration(150) : undefined}
            style={StyleSheet.flatten([{ zIndex: 50, flex: 1 }])}
          >
            <SelectPrimitive.Content
              ref={ref}
              position={position}
              style={StyleSheet.flatten([
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: radius.md,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 10,
                  width: context?.triggerWidth
                    ? context.triggerWidth
                    : 128,
                  padding: Platform.OS === "web" ? 4 : 8,
                  overflow: "hidden",
                },
                Platform.OS === "web" ? { maxHeight: 250 } : undefined,
                style,
              ])}
              {...props}
            >
              <SelectScrollUpButton />

              <SelectPrimitive.Viewport
                style={StyleSheet.flatten([
                  { padding: 4 },
                  position === "popper" && Platform.OS === "web"
                    ? { width: "100%" }
                    : undefined,
                ])}
              >
                {children}
              </SelectPrimitive.Viewport>

              <SelectScrollDownButton />
            </SelectPrimitive.Content>
          </AnimatedView>
        </SelectPrimitive.Overlay>
      </FullWindowOverlay>
    </SelectPrimitive.Portal>
  );
});

SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ style, ...props }, ref) => {
  const { theme } = useTheme();
  const { colors, typography } = THEME[theme];

  return (
    <SelectPrimitive.Label
      ref={ref}
      style={StyleSheet.flatten([
        {
          paddingHorizontal: 8,
          paddingVertical: 8,
          fontSize: typography.xs,
          fontWeight: "600",
          color: colors.mutedForeground,
        },
        style,
      ])}
      {...props}
    />
  );
});

SelectLabel.displayName = "SelectLabel";
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ style, children, ...props }, ref) => {
  const { theme } = useTheme();
  const { colors, typography, radius } = THEME[theme];

  // Abstract the inner content
  const InnerItemContent = () => (
    <>
      <View
        style={StyleSheet.flatten([
          {
            position: "absolute",
            right: 8,
            justifyContent: "center",
            alignItems: "center",
          },
        ])}
      >
        <SelectPrimitive.ItemIndicator>
          <Feather name="check" size={16} color={colors.foreground} />
        </SelectPrimitive.ItemIndicator>
      </View>

      <SelectPrimitive.ItemText
        numberOfLines={1}
        style={StyleSheet.flatten([
          {
            fontSize: typography.sm,
            color: colors.foreground,
          },
        ])}
      />
    </>
  );

  return (
    <SelectPrimitive.Item
      ref={ref}
      style={
        Platform.OS === "web"
          ? StyleSheet.flatten([
              {
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 8,
                paddingVertical: 8,
                paddingRight: 32,
                borderRadius: radius.sm,
                opacity: props.disabled ? 0.5 : 1,
                outlineStyle: "none",
              },
              style as any,
            ])
          : ((state: any) =>
              StyleSheet.flatten([
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 8,
                  paddingVertical: 12,
                  paddingRight: 32,
                  borderRadius: radius.sm,
                  opacity: props.disabled ? 0.5 : 1,
                  backgroundColor:
                    (state as any).focused || state.pressed
                      ? colors.muted
                      : "transparent",
                },
                typeof style === "function" ? style(state) : style,
              ])) as any
      }
      {...props}
    >
      {/* Conditionally pass children based on platform */}
      {Platform.OS === "web" ? <InnerItemContent /> : (((state: any) => <InnerItemContent />) as any)}
    </SelectPrimitive.Item>
  );
});

SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ style, ...props }, ref) => {
  const { theme } = useTheme();
  const { colors } = THEME[theme];

  return (
    <SelectPrimitive.Separator
      ref={ref}
      style={StyleSheet.flatten([
        {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: 4,
          marginHorizontal: -4,
        },
        Platform.OS === "web" ? { pointerEvents: "none" } : undefined,
        style,
      ])}
      {...props}
    />
  );
});

SelectSeparator.displayName = "SelectSeparator";

function SelectScrollUpButton({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  if (Platform.OS !== "web") return null;

  const { theme } = useTheme();

  return (
    <SelectPrimitive.ScrollUpButton
      style={StyleSheet.flatten([
        {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 4,
        },
      ])}
      {...props}
    >
      <Feather
        name="chevron-up"
        size={16}
        color={THEME[theme].colors.foreground}
      />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  if (Platform.OS !== "web") return null;

  const { theme } = useTheme();

  return (
    <SelectPrimitive.ScrollDownButton
      style={StyleSheet.flatten([
        {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 4,
        },
      ])}
      {...props}
    >
      <Feather
        name="chevron-down"
        size={16}
        color={THEME[theme].colors.foreground}
      />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type Option,
};