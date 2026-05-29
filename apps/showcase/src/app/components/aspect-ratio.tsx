import AspectRatio from '@/components/ui/aspect-ratio';
import { Image } from 'react-native';

export default function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} style={{ width: '100%' }}>
      <Image
        source={{ uri: 'https://picsum.photos/800/450' }}
        style={{ width: '100%', height: '100%', borderRadius: 12 }}
        resizeMode="cover"
      />
    </AspectRatio>
  );
}
