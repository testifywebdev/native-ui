import Progress from '@/components/ui/progress';
import { useState, useEffect } from 'react';

export default function ProgressDemo() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setValue(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return <Progress value={value} />;
}
