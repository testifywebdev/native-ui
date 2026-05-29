import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from '@/components/ui/carousel';
import { View, Text, StyleSheet, Platform } from 'react-native';

const slides = [
  { id: '1', title: 'Slide 1', color: '#fca5a5' }, 
  { id: '2', title: 'Slide 2', color: '#bae6fd' }, 
  { id: '3', title: 'Slide 3', color: '#bbf7d0' }, 
  { id: '4', title: 'Slide 4', color: '#fef08a' },
];

export default function CarouselDemo() {
  return (
    <View style={styles.container}>
      <Carousel style={styles.carousel}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <View style={styles.slideWrapper}>
                <View style={[styles.slideCard, { backgroundColor: slide.color }]}>
                  <Text style={styles.title}>{slide.title}</Text>
                </View>
              </View>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious style={{ left: 24 }} />
        <CarouselNext style={{ right: 24 }} />
        
        <CarouselDots style={{ marginTop: 24 }} />
      </Carousel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  carousel: {
    width: '100%',
    maxWidth: 600, 
  },
  slideWrapper: {

    paddingHorizontal: 16, 
  },
  slideCard: {
    height: 350, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
      } as any,
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b', 
    letterSpacing: -0.5,
  },
});