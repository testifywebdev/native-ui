import Label from '@/components/ui/label';
import Input from '@/components/ui/input';

export default function LabelDemo() {
  return (
    <>
      <Label required>Email address</Label>
      <Input placeholder="you@example.com" inputMode="email" />
    </>
  );
}
