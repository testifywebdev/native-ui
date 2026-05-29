import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function SelectDemo() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a fruit…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple" label="Apple" />
        <SelectItem value="banana" label="Banana" />
        <SelectItem value="mango" label="Mango" />
        <SelectItem value="orange" label="Orange" />
      </SelectContent>
    </Select>
  );
}
