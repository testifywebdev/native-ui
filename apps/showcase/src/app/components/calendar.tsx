import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

export default function CalendarDemo() {
  const [selected, setSelected] = useState('');

  return (
    <Calendar
      onDayPress={(day) => setSelected(day.dateString)}
      markedDates={{
        [selected]: { selected: true, selectedColor: '#18181b' },
      }}
    />
  );
}
