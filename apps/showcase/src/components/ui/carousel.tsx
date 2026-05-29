import { THEME, useTheme } from "@/lib/theme";
import React, { createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
import { FlatList, FlatListProps, Pressable, StyleProp, StyleSheet, View, ViewProps, ViewStyle, ViewToken, } from "react-native";
type ChevronProps = {
    color?: string;
    size?: number;
    strokeWidth?: number;
};
function ChevronLeft({ color = "#000", size = 16, strokeWidth = 2 }: ChevronProps) {
    const arm = size * 0.35;
    return (<View style={{
            width: arm,
            height: arm,
            borderTopWidth: strokeWidth,
            borderLeftWidth: strokeWidth,
            borderColor: color,
            transform: [{ rotate: "-45deg" }],
            marginLeft: arm * 0.4,
        }}/>);
}
function ChevronRight({ color = "#000", size = 16, strokeWidth = 2 }: ChevronProps) {
    const arm = size * 0.35;
    return (<View style={{
            width: arm,
            height: arm,
            borderTopWidth: strokeWidth,
            borderRightWidth: strokeWidth,
            borderColor: color,
            transform: [{ rotate: "45deg" }],
            marginRight: arm * 0.4,
        }}/>);
}
type CarouselContextValue = {
    flatListRef: React.RefObject<FlatList<React.ReactNode> | null>;
    virtualIndex: number;
    setVirtualIndex: (index: number) => void;
    totalItems: number;
    setTotalItems: (n: number) => void;
    itemWidth: number;
    setItemWidth: (w: number) => void;
    scrollToVirtualIndex: (index: number) => void;
    setIsDragging: (dragging: boolean) => void;
    loop: boolean;
    orientation: "horizontal" | "vertical";
};
const CarouselContext = createContext<CarouselContextValue | null>(null);
function useCarouselContext(): CarouselContextValue {
    const ctx = useContext(CarouselContext);
    if (!ctx)
        throw new Error("Must be used within <Carousel>");
    return ctx;
}
type CarouselProps = ViewProps & {
    loop?: boolean;
    orientation?: "horizontal" | "vertical";
    autoplayInterval?: number;
    style?: StyleProp<ViewStyle>;
};
const Carousel = forwardRef<View, CarouselProps>(({ children, loop = false, orientation = "horizontal", autoplayInterval = 0, style, ...props }, ref) => {
    const flatListRef = useRef<FlatList<React.ReactNode>>(null);
    const [virtualIndex, setVirtualIndex] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [itemWidth, setItemWidth] = useState(0);
    const isDraggingRef = useRef(false);
    const setIsDragging = useCallback((dragging: boolean) => {
        isDraggingRef.current = dragging;
    }, []);
    const scrollToVirtualIndex = useCallback((index: number) => {
        if (itemWidth === 0 || totalItems === 0)
            return;
        const target = loop
            ? index
            : Math.max(0, Math.min(index, totalItems - 1));
        flatListRef.current?.scrollToIndex({ index: target, animated: true });
        setVirtualIndex(target);
    }, [itemWidth, totalItems, loop]);
    useEffect(() => {
        if (autoplayInterval <= 0 || totalItems <= 1)
            return;
        const timer = setInterval(() => {
            if (isDraggingRef.current)
                return;
            const nextIndex = loop
                ? virtualIndex + 1
                : virtualIndex + 1 < totalItems
                    ? virtualIndex + 1
                    : 0;
            scrollToVirtualIndex(nextIndex);
        }, autoplayInterval);
        return () => clearInterval(timer);
    }, [autoplayInterval, virtualIndex, totalItems, loop, scrollToVirtualIndex]);
    const value = useMemo<CarouselContextValue>(() => ({
        flatListRef,
        virtualIndex,
        setVirtualIndex,
        totalItems,
        setTotalItems,
        itemWidth,
        setItemWidth,
        scrollToVirtualIndex,
        setIsDragging,
        loop,
        orientation,
    }), [
        virtualIndex,
        totalItems,
        itemWidth,
        scrollToVirtualIndex,
        setIsDragging,
        loop,
        orientation,
    ]);
    return (<CarouselContext.Provider value={value}>
        <View ref={ref} style={[styles.root, style]} {...props}>
          {children}
        </View>
      </CarouselContext.Provider>);
});
Carousel.displayName = "Carousel";
const LOOPS_COUNT = 100;
type CarouselContentProps = Omit<FlatListProps<React.ReactNode>, "data" | "renderItem" | "horizontal" | "ref"> & {
    style?: StyleProp<ViewStyle>;
};
const CarouselContent = forwardRef<FlatList<React.ReactNode>, CarouselContentProps>(({ children, style, ...props }, forwardedRef) => {
    const { flatListRef, setItemWidth, setTotalItems, setVirtualIndex, setIsDragging, itemWidth, orientation, loop, } = useCarouselContext();
    const isHorizontal = orientation === "horizontal";
    const originalData = useMemo(() => React.Children.toArray(children), [children]);
    const isLooping = loop && originalData.length > 1;
    const data = useMemo(() => {
        return isLooping ? Array(LOOPS_COUNT).fill(originalData).flat() : originalData;
    }, [isLooping, originalData]);
    const initialScrollIndex = useMemo(() => {
        return isLooping ? Math.floor(LOOPS_COUNT / 2) * originalData.length : 0;
    }, [isLooping, originalData.length]);
    useEffect(() => {
        setTotalItems(originalData.length);
        setVirtualIndex(initialScrollIndex);
    }, [originalData.length, initialScrollIndex, setTotalItems, setVirtualIndex]);
    const setRef = useCallback((node: FlatList<React.ReactNode> | null) => {
        (flatListRef as React.MutableRefObject<FlatList<React.ReactNode> | null>).current = node;
        if (typeof forwardedRef === "function")
            forwardedRef(node);
        else if (forwardedRef) {
            (forwardedRef as React.MutableRefObject<FlatList<React.ReactNode> | null>).current = node;
        }
    }, [flatListRef, forwardedRef]);
    const onViewableItemsChanged = useCallback(({ viewableItems }: {
        viewableItems: ViewToken[];
    }) => {
        const index = viewableItems[0]?.index;
        if (index != null)
            setVirtualIndex(index);
    }, [setVirtualIndex]);
    const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 50 }), []);
    return (<View style={[styles.flatListWrapper, style]} onLayout={(e) => {
            const size = isHorizontal ? e.nativeEvent.layout.width : e.nativeEvent.layout.height;
            setItemWidth(size);
        }}>
        {itemWidth > 0 && (<FlatList<React.ReactNode> ref={setRef} data={data} keyExtractor={(_, index) => index.toString()} renderItem={({ item }) => item as React.ReactElement} horizontal={isHorizontal} pagingEnabled showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} decelerationRate="fast" initialScrollIndex={initialScrollIndex} getItemLayout={(_, index) => ({
                length: itemWidth,
                offset: itemWidth * index,
                index,
            })} onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig} onScrollBeginDrag={(e) => {
                setIsDragging(true);
                props.onScrollBeginDrag?.(e);
            }} onScrollEndDrag={(e) => {
                setIsDragging(false);
                props.onScrollEndDrag?.(e);
            }} style={styles.flatList} {...props}/>)}
      </View>);
});
CarouselContent.displayName = "CarouselContent";
type CarouselItemProps = ViewProps & {
    style?: StyleProp<ViewStyle>;
};
const CarouselItem = forwardRef<View, CarouselItemProps>(({ children, style, ...props }, ref) => {
    const { itemWidth, orientation } = useCarouselContext();
    const sizeStyle = useMemo<ViewStyle>(() => (orientation === "horizontal" ? { width: itemWidth } : { height: itemWidth }), [itemWidth, orientation]);
    return (<View ref={ref} style={[sizeStyle, style]} {...props}>
        {children}
      </View>);
});
CarouselItem.displayName = "CarouselItem";
const NAV_SIZE = 32;
type NavButtonProps = {
    side: "prev" | "next";
    onPress: () => void;
    disabled: boolean;
    style?: StyleProp<ViewStyle>;
};
function NavButton({ side, onPress, disabled, style }: NavButtonProps) {
    const { theme } = useTheme();
    const { colors, radius } = THEME[theme];
    const { orientation } = useCarouselContext();
    const isPrev = side === "prev";
    const isHorizontal = orientation === "horizontal";
    const wrapperStyle: ViewStyle = isHorizontal
        ? {
            top: 0,
            bottom: 0,
            width: NAV_SIZE + 16,
            [isPrev ? "left" : "right"]: 0,
        }
        : {
            left: 0,
            right: 0,
            height: NAV_SIZE + 16,
            [isPrev ? "top" : "bottom"]: 0,
        };
    const iconTransform = isHorizontal ? undefined : [{ rotate: "90deg" }];
    return (<View pointerEvents="box-none" style={[styles.navWrapperBase, wrapperStyle]}>
      <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={isPrev ? "Previous slide" : "Next slide"} style={({ pressed }) => [
            styles.navButton,
            {
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderRadius: radius.full,
                opacity: disabled ? 0.35 : pressed ? 0.7 : 1,
                transform: iconTransform,
            },
            style,
        ]}>
        {isPrev ? (<ChevronLeft color={colors.foreground} size={16} strokeWidth={2}/>) : (<ChevronRight color={colors.foreground} size={16} strokeWidth={2}/>)}
      </Pressable>
    </View>);
}
type CarouselNavProps = {
    style?: StyleProp<ViewStyle>;
};
const CarouselPrevious = forwardRef<View, CarouselNavProps>(({ style }, _ref) => {
    const { virtualIndex, scrollToVirtualIndex, loop } = useCarouselContext();
    const canScrollPrev = loop ? true : virtualIndex > 0;
    const handlePress = () => scrollToVirtualIndex(virtualIndex - 1);
    return <NavButton side="prev" onPress={handlePress} disabled={!canScrollPrev} style={style}/>;
});
CarouselPrevious.displayName = "CarouselPrevious";
const CarouselNext = forwardRef<View, CarouselNavProps>(({ style }, _ref) => {
    const { virtualIndex, totalItems, scrollToVirtualIndex, loop } = useCarouselContext();
    const canScrollNext = loop ? true : virtualIndex < totalItems - 1;
    const handlePress = () => scrollToVirtualIndex(virtualIndex + 1);
    return <NavButton side="next" onPress={handlePress} disabled={!canScrollNext} style={style}/>;
});
CarouselNext.displayName = "CarouselNext";
const CarouselDots = forwardRef<View, CarouselNavProps>(({ style }, ref) => {
    const { theme } = useTheme();
    const { colors, spacing } = THEME[theme];
    const { virtualIndex, totalItems, scrollToVirtualIndex, orientation } = useCarouselContext();
    if (totalItems <= 1)
        return null;
    const currentIndex = totalItems > 0 ? virtualIndex % totalItems : 0;
    const isHorizontal = orientation === "horizontal";
    const handleDotPress = (dotIndex: number) => {
        const diff = dotIndex - currentIndex;
        scrollToVirtualIndex(virtualIndex + diff);
    };
    return (<View ref={ref} style={[
            styles.dots,
            isHorizontal
                ? { flexDirection: "row", marginTop: spacing.md }
                : { flexDirection: "column", marginLeft: spacing.md },
            style,
        ]}>
      {Array.from({ length: totalItems }).map((_, i) => (<Pressable key={i} onPress={() => handleDotPress(i)} accessibilityRole="button" accessibilityLabel={`Go to slide ${i + 1}`} hitSlop={8} style={[
                styles.dot,
                {
                    backgroundColor: i === currentIndex ? colors.primary : colors.muted,
                    width: isHorizontal ? (i === currentIndex ? 20 : 6) : 6,
                    height: isHorizontal ? 6 : (i === currentIndex ? 20 : 6),
                },
            ]}/>))}
    </View>);
});
CarouselDots.displayName = "CarouselDots";
const styles = StyleSheet.create({
    root: {
        position: "relative",
    },
    flatListWrapper: {
        flexGrow: 0,
    },
    flatList: {
        flexGrow: 0,
    },
    navWrapperBase: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    navButton: {
        width: NAV_SIZE,
        height: NAV_SIZE,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    dots: {
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        borderRadius: 3,
    },
});
export { Carousel, CarouselContent, CarouselDots, CarouselItem, CarouselNext, CarouselPrevious, };