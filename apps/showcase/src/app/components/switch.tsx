import Switch from '@/components/ui/switch';
import { useState } from 'react';

export default function SwitchDemo() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      value={enabled}
      onValueChange={setEnabled}
      accessibilityLabel="Enable notifications"
    />
  );
}
