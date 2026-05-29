import { THEME, useTheme } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import * as React from "react";
import { View, type ViewProps } from "react-native";
import { Calendar as RNCalendar, type CalendarProps } from "react-native-calendars";
const CalendarArrow = ({ direction }: {
    direction: "left" | "right";
}) => {
    const { theme } = useTheme();
    const { colors, radius } = THEME[theme];
    return (<View style={{
            height: 36,
            width: 36,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: "transparent",
        }}>
      <Feather name={direction === "left" ? "chevron-left" : "chevron-right"} size={16} color={colors.foreground}/>
    </View>);
};
type CustomCalendarProps = CalendarProps & {
    containerStyle?: ViewProps["style"];
};
function Calendar({ containerStyle, theme: customTheme, ...props }: CustomCalendarProps) {
    const { theme } = useTheme();
    const { colors, typography, radius } = THEME[theme];
    const CELL_SIZE = 36;
    const CELL_RADIUS = radius.md;
    return (<View style={[
            {
                padding: 12,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radius.lg,
                width: "auto",
                alignSelf: "flex-start",
            },
            containerStyle,
        ]}>
      <RNCalendar renderArrow={(direction) => <CalendarArrow direction={direction}/>} markingType="custom" theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            monthTextColor: colors.foreground,
            textMonthFontWeight: "600",
            textMonthFontSize: typography.sm,
            textSectionTitleColor: colors.mutedForeground,
            textDayHeaderFontWeight: "400",
            textDayHeaderFontSize: 13,
            dayTextColor: colors.foreground,
            textDayFontSize: typography.sm,
            textDayFontWeight: "400",
            textDisabledColor: colors.mutedForeground,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: colors.primaryForeground,
            todayTextColor: colors.foreground,
            stylesheet: {
                calendar: {
                    header: {
                        header: {
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 4,
                            marginBottom: 16,
                            width: "100%",
                        },
                        monthText: {
                            fontSize: typography.sm,
                            fontWeight: "600",
                            color: colors.foreground,
                            margin: 0,
                        },
                        dayHeader: {
                            marginTop: 2,
                            marginBottom: 8,
                            width: CELL_SIZE,
                            textAlign: "center",
                            fontSize: 13,
                            color: colors.mutedForeground,
                            fontWeight: "400",
                        },
                    },
                },
                day: {
                    basic: {
                        base: {
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: CELL_RADIUS,
                        },
                        text: {
                            marginTop: 0,
                            fontSize: typography.sm,
                            fontWeight: "400",
                            color: colors.foreground,
                            backgroundColor: "transparent",
                        },
                        alignedText: {
                            marginTop: 0,
                        },
                        selected: {
                            backgroundColor: colors.primary,
                            borderRadius: CELL_RADIUS,
                        },
                        today: {
                            backgroundColor: colors.muted,
                            borderRadius: CELL_RADIUS,
                        },
                        todayText: {
                            color: colors.foreground,
                        },
                        disabledText: {
                            color: colors.mutedForeground,
                            opacity: 0.5,
                        },
                    },
                },
            },
            ...customTheme,
        }} {...props}/>
    </View>);
}
export { Calendar };