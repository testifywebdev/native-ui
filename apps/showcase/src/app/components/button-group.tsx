import { ButtonGroup } from '@/components/ui/button-group';
import Button from '@/components/ui/button';

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button title="Day" variant="outline" />
      <Button title="Week" variant="outline" />
      <Button title="Month" variant="outline" />
    </ButtonGroup>
  );
}
