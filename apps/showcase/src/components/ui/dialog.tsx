import { THEME, useTheme } from "@/lib/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as DialogPrimitive from "@rn-primitives/dialog";
import React, { forwardRef } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;
const isNative = Platform.OS !== "web";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

Dialog.displayName = "Dialog";
DialogTrigger.displayName = "DialogTrigger";
DialogClose.displayName = "DialogClose";

type DialogOverlayProps = Omit<
  React.ComponentProps<typeof DialogPrimitive.Overlay>,
  "asChild"
> & {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const DialogOverlay = forwardRef<View, DialogOverlayProps>(
  ({ children, style, ...rest }, ref) => {
    return (
      <FullWindowOverlay>
        <DialogPrimitive.Overlay closeOnPress {...rest} asChild={isNative}>
          <Animated.View
            ref={ref}
            entering={isNative ? FadeIn.duration(200) : undefined}
            exiting={isNative ? FadeOut.duration(180) : undefined}
            style={StyleSheet.flatten([
              styles.overlay,
              // Fix: Ensure overlay stays pinned on web regardless of scroll
              Platform.OS === "web" && { position: "fixed" as any, zIndex: 50 },
              style,
            ])}
            accessibilityElementsHidden={false}
            importantForAccessibility="yes"
          >
            <Animated.View
              entering={isNative ? FadeIn.duration(200).delay(30) : undefined}
              exiting={isNative ? FadeOut.duration(150) : undefined}
              style={StyleSheet.flatten([
                StyleSheet.absoluteFill,
                { pointerEvents: "box-none" },
                // Fix: Pin the inner container on web as well
                Platform.OS === "web" && { position: "fixed" as any },
              ])}
            >
              {children}
            </Animated.View>
          </Animated.View>
        </DialogPrimitive.Overlay>
      </FullWindowOverlay>
    );
  }
);
DialogOverlay.displayName = "DialogOverlay";

type DialogContentProps = Omit<
  React.ComponentProps<typeof DialogPrimitive.Content>,
  "asChild"
> & {
  portalHost?: string;
  showCloseButton?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const DialogContent = forwardRef<View, DialogContentProps>(
  (
    {
      portalHost,
      showCloseButton = true,
      style,
      children,
      accessibilityLabel = "Dialog",
      ...rest
    },
    ref
  ) => {
    const { theme } = useTheme();
    const { colors, spacing, radius } = THEME[theme];

    // Abstract the content node so we don't repeat code
    const contentNode = (
      <DialogPrimitive.Content
        {...rest}
        asChild={isNative}
        accessibilityRole="none"
      >
        <Animated.View
          ref={ref}
          entering={isNative ? ZoomIn.duration(220).springify() : undefined}
          exiting={isNative ? ZoomOut.duration(180) : undefined}
          accessibilityRole="none"
          accessibilityLabel={accessibilityLabel}
          accessibilityViewIsModal
          importantForAccessibility="yes"
          style={StyleSheet.flatten([
            {
              backgroundColor: colors.popover,
              borderRadius: radius.xl,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border,
              padding: spacing["2xl"],
              gap: spacing.lg,
              width: "100%",
              maxWidth: 512,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 24,
                },
                android: { elevation: 12 },
                web: {
                  boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                  // Fix: Web centering utilizing fixed positioning since it's no longer nested
                  position: "fixed" as any,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 51,
                },
              }),
            },
            style,
          ])}
        >
          {children}

          {showCloseButton && (
  <View
    style={{
      position: "absolute",
      top: spacing.lg,
      right: spacing.lg,
      zIndex: 100, // Ensure it stays on top of the content
    }}
  >
    <DialogPrimitive.Close asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close dialog"
        hitSlop={12}
        style={({ pressed }) =>
          StyleSheet.flatten([
            {
              width: 28,
              height: 28,
              borderRadius: radius.md,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pressed ? colors.accent : "transparent",
              opacity: pressed ? 1 : 0.7,
            },
          ])
        }
      >
        <AntDesign
          name="close"
          size={16}
          color={colors.popoverForeground}
          strokeWidth={2}
        />
      </Pressable>
    </DialogPrimitive.Close>
  </View>
)}
        </Animated.View>
      </DialogPrimitive.Content>
    );

    // Fix: Radix strictly demands sibling structure on Web
    if (Platform.OS === "web") {
      return (
        <DialogPortal hostName={portalHost}>
          <DialogOverlay />
          {contentNode}
        </DialogPortal>
      );
    }

    // Native: Keep it nested so flexbox centering and FullWindowOverlay work flawlessly
    return (
      <DialogPortal hostName={portalHost}>
        <DialogOverlay>
          {contentNode}
        </DialogOverlay>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = "DialogContent";
type DialogHeaderProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
};

const DialogHeader = forwardRef<View, DialogHeaderProps>(
  ({ style, ...rest }, ref) => {
    const { theme } = useTheme();
    const { spacing } = THEME[theme];
    return (
      <View
        ref={ref}
        {...rest}
        style={[{ flexDirection: "column", gap: spacing.xs }, style]}
      />
    );
  }
);
DialogHeader.displayName = "DialogHeader";

type DialogFooterProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
};

const DialogFooter = forwardRef<View, DialogFooterProps>(
  ({ style, ...rest }, ref) => {
    const { theme } = useTheme();
    const { spacing } = THEME[theme];
    return (
      <View
        ref={ref}
        {...rest}
        style={[
          {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: spacing.sm,
            flexWrap: "wrap",
          },
          style,
        ]}
      />
    );
  }
);
DialogFooter.displayName = "DialogFooter";

type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title> & {
  style?: StyleProp<TextStyle>;
};

// DialogTitle — was passing array to DialogPrimitive.Title
const DialogTitle = forwardRef<Text, DialogTitleProps>(({ style, ...rest }, ref) => {
  const { theme } = useTheme();
  const { colors, typography } = THEME[theme];
  return (
    <DialogPrimitive.Title
      ref={ref}
      {...rest}
      style={StyleSheet.flatten([      
        {
          fontSize: typography.lg,
          fontWeight: "700",
          color: colors.popoverForeground,
          letterSpacing: -0.3,
        },
        style,
      ])}
    />
  );
});
DialogTitle.displayName = "DialogTitle";

type DialogDescriptionProps = React.ComponentProps <typeof DialogPrimitive.Description
> & {
  style?: StyleProp<TextStyle>;
};

// DialogDescription — same issue
const DialogDescription = forwardRef<Text, DialogDescriptionProps>(({ style, ...rest }, ref) => {
  const { theme } = useTheme();
  const { colors, typography } = THEME[theme];
  return (
    <DialogPrimitive.Description
      ref={ref}
      {...rest}
      style={StyleSheet.flatten([       
        {
          fontSize: typography.sm,
          lineHeight: typography.sm * 1.6,
          color: colors.mutedForeground,
        },
        style,
      ])}
    />
  );
});
DialogDescription.displayName = "DialogDescription";

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

export const DialogCompound = {
  Root: Dialog,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};