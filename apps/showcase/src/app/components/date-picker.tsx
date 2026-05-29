import { DatePicker } from '@/components/ui/date-picker';
import { useState } from 'react';

export default function DatePickerDemo() {
  const [date, setDate] = useState('');

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Pick a date"
    />
  );
}
