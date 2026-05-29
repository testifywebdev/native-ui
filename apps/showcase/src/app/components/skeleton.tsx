import Skeleton from '@/components/ui/skeleton';
import { View } from 'react-native';

export default function SkeletonDemo() {
  return (
    <View style={{ gap: 12 }}>
      <Skeleton style={{ height: 20, width: '80%' }} />
      <Skeleton style={{ height: 20, width: '60%' }} />
      <Skeleton style={{ height: 20, width: '70%' }} />
    </View>
  );
}
