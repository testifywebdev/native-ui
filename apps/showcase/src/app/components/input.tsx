import Input from '@/components/ui/input';
import { useState } from 'react';

export default function InputDemo() {
  const [value, setValue] = useState('');

  return (
    <Input
      label="Email"
      placeholder="you@example.com"
      value={value}
      onChangeText={setValue}
      inputMode="email"
    />
  );
}
