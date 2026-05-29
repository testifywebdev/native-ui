import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function TextareaDemo() {
  const [value, setValue] = useState('');

  return (
    <Textarea
      placeholder="Write your message here…"
      value={value}
      onChangeText={setValue}
    />
  );
}
