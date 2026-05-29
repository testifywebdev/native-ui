import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { View, Text } from 'react-native';
import { useState } from 'react';

const options = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
  { value: 'spacious', label: 'Spacious' },
];

export default function RadioGroupDemo() {
  const [selected, setSelected] = useState('comfortable');

  return (
    <RadioGroup value={selected} onValueChange={setSelected}>
      {options.map((option) => (
        <View key={option.value} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <RadioGroupItem value={option.value} aria-labelledby={`label-${option.value}`} />
          <Text nativeID={`label-${option.value}`}>{option.label}</Text>
        </View>
      ))}
    </RadioGroup>
  );
}
