import { Calendar } from "@/components/ui/calendar";
import { THEME, useTheme } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import * as React from "react";
import { Modal, Pressable, Text, TouchableWithoutFeedback, View, type ViewStyle, } from "react-native";
export type DatePickerProps = {
    value?: string;
    onChange?: (date: string) => void;
    placeholder?: string;
    style?: ViewStyle;
};
export function DatePicker({ value, onChange, placeholder = "Pick a date", style, }: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { theme } = useTheme();
    const { colors, typography, radius, spacing } = THEME[theme];
    const formattedDate = React.useMemo(() => {
        if (!value)
            return null;
        try {
            const [year, month, day] = value.split("-").map(Number);
            const dateObj = new Date(year, month - 1, day);
            return dateObj.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
        }
        catch {
            return value;
        }
    }, [value]);
    return (<>
      
      <Pressable onPress={() => setIsOpen(true)} style={[
            {
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.background,
                borderRadius: radius.md,
                paddingHorizontal: spacing.md,
                height: 44,
                gap: 8,
            },
            style,
        ]}>
        <Feather name="calendar" size={16} color={colors.mutedForeground}/>
        <Text style={{
            fontSize: typography.sm,
            color: value ? colors.foreground : colors.mutedForeground,
            fontWeight: value ? "500" : "400",
            flex: 1,
        }}>
          {value ? formattedDate : placeholder}
        </Text>
      </Pressable>

      
      <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={() => setIsOpen(false)}>
        
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.lg,
        }}>
            
            <TouchableWithoutFeedback>
              <View style={{
            width: "100%",
            maxWidth: 340,
            backgroundColor: colors.card,
            borderRadius: radius.lg,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
        }}>
                <Calendar containerStyle={{ borderWidth: 0, width: "100%" }} current={value || new Date().toISOString().split("T")[0]} onDayPress={(day) => {
            onChange?.(day.dateString);
            setIsOpen(false);
        }} markedDates={value
            ? {
                [value]: {
                    selected: true,
                    customStyles: {
                        container: {
                            backgroundColor: colors.primary,
                            borderRadius: radius.md,
                        },
                        text: {
                            color: colors.primaryForeground,
                            fontWeight: "600",
                        },
                    },
                },
            }
            : {}}/>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>);
}