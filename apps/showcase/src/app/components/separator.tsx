import Separator from '@/components/ui/separator';
import { Text } from 'react-native';
export default function SeparatorDemo() {
  return (
    <>
    <Text style={{ fontWeight: '600' }}>
      lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur varius. Sed at ligula a enim efficitur commodo. Nulla facilisi. Donec ac odio a nisl convallis tincidunt. In hac habitasse platea dictumst. Curabitur ut ligula sed nunc fermentum bibendum.
    </Text>
    <Separator />
    <Text>
      lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur varius. Sed at ligula a enim efficitur commodo. Nulla facilisi. Donec ac odio a nisl convallis tincidunt. In hac habitasse platea dictumst. Curabitur ut ligula sed nunc fermentum bibendum.
    </Text>
    </>
  )
}
