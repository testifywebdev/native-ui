import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Text } from 'react-native';

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
   <>
      <Text style={{ fontWeight: '600' }}>Accept terms and conditions</Text>
    <Checkbox
      checked={checked}
      onCheckedChange={setChecked}
      accessibilityLabel="Accept terms and conditions"
    />
   </>
  );
}
