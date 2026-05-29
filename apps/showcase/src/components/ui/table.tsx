import { THEME, useTheme } from "@/lib/theme";
import * as TablePrimitive from "@rn-primitives/table";
import * as React from "react";
import { ScrollView, StyleSheet, Text, View, type StyleProp, type TextStyle, } from "react-native";
const isTextOnly = (children: React.ReactNode): boolean => {
    if (typeof children === "string" || typeof children === "number")
        return true;
    if (Array.isArray(children)) {
        return children.every((child) => typeof child === "string" ||
            typeof child === "number" ||
            child == null);
    }
    return false;
};
const Table = React.forwardRef<React.ElementRef<typeof TablePrimitive.Root>, React.ComponentPropsWithoutRef<typeof TablePrimitive.Root>>(({ style, ...props }, ref) => {
    return (<ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ minWidth: "100%" }}>
      <TablePrimitive.Root ref={ref} style={[{ width: "100%" }, style]} {...props}/>
    </ScrollView>);
});
Table.displayName = "Table";
const TableHeader = React.forwardRef<React.ElementRef<typeof TablePrimitive.Header>, React.ComponentPropsWithoutRef<typeof TablePrimitive.Header>>(({ style, ...props }, ref) => {
    const { theme } = useTheme();
    const { colors } = THEME[theme];
    return (<TablePrimitive.Header ref={ref} style={[
            {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
            },
            style,
        ]} {...props}/>);
});
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef<React.ElementRef<typeof TablePrimitive.Body>, React.ComponentPropsWithoutRef<typeof TablePrimitive.Body>>(({ style, ...props }, ref) => {
    return <TablePrimitive.Body ref={ref} style={[style]} {...props}/>;
});
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef<React.ElementRef<typeof TablePrimitive.Footer>, React.ComponentPropsWithoutRef<typeof TablePrimitive.Footer>>(({ style, ...props }, ref) => {
    const { theme } = useTheme();
    const { colors } = THEME[theme];
    return (<TablePrimitive.Footer ref={ref} style={[
            {
                borderTopWidth: 1,
                borderTopColor: colors.border,
                backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
            },
            style,
        ]} {...props}/>);
});
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef<React.ElementRef<typeof TablePrimitive.Row>, React.ComponentPropsWithoutRef<typeof TablePrimitive.Row>>(({ style, ...props }, ref) => {
    const { theme } = useTheme();
    const { colors } = THEME[theme];
    return (<TablePrimitive.Row ref={ref} style={(state) => [
            {
                flexDirection: "row",
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
            },
            typeof style === "function" ? style(state) : style,
        ]} {...props}/>);
});
TableRow.displayName = "TableRow";
type TableCellProps = React.ComponentPropsWithoutRef<typeof TablePrimitive.Cell> & {
    textStyle?: StyleProp<TextStyle>;
};
const TableHead = React.forwardRef<React.ElementRef<typeof TablePrimitive.Head>, TableCellProps>(({ style, textStyle, children, ...props }, ref) => {
    const { theme } = useTheme();
    const { colors, typography } = THEME[theme];
    return (<TablePrimitive.Head ref={ref} style={[
            {
                height: 40,
                paddingHorizontal: 8,
                justifyContent: "center",
                alignItems: "flex-start",
                flex: 1,
            },
            style,
        ]} {...props}>
      {isTextOnly(children) ? (<Text numberOfLines={1} style={[
                {
                    color: colors.mutedForeground,
                    fontSize: typography.sm,
                    fontWeight: "600",
                },
                textStyle,
            ]}>
          {children}
        </Text>) : (children)}
    </TablePrimitive.Head>);
});
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef<React.ElementRef<typeof TablePrimitive.Cell>, TableCellProps>(({ style, textStyle, children, ...props }, ref) => {
    const { theme } = useTheme();
    const { colors, typography } = THEME[theme];
    return (<TablePrimitive.Cell ref={ref} style={[
            {
                paddingVertical: 12,
                paddingHorizontal: 8,
                justifyContent: "center",
                alignItems: "flex-start",
                flex: 1,
            },
            style,
        ]} {...props}>
      {isTextOnly(children) ? (<Text style={[
                {
                    color: colors.foreground,
                    fontSize: typography.sm,
                },
                textStyle,
            ]}>
          {children}
        </Text>) : (children)}
    </TablePrimitive.Cell>);
});
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef<React.ElementRef<typeof Text>, React.ComponentPropsWithoutRef<typeof Text>>(({ style, ...props }, ref) => {
    const { theme } = useTheme();
    const { colors, typography } = THEME[theme];
    return (<View style={{ marginTop: 16, marginBottom: 8, alignItems: "center" }}>
      <Text ref={ref} style={[
            {
                color: colors.mutedForeground,
                fontSize: typography.sm,
                textAlign: "center",
            },
            style,
        ]} {...props}/>
    </View>);
});
TableCaption.displayName = "TableCaption";
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, };