import Button from '@/components/ui/button';

export default function ButtonDemo() {
  return <Button title="Click me" onPress={() => console.log('pressed')} />;
}
