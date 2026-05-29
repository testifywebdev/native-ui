import {
  Card,
  CardHeader,
  CardTitleGroup,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Text } from 'react-native';

export default function CardDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitleGroup>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here.</CardDescription>
        </CardTitleGroup>
      </CardHeader>
      <CardContent>
        <Text>Card body content.</Text>
      </CardContent>
      <CardFooter>
        <Button title="Cancel" variant="outline" />
        <Button title="Confirm" />
      </CardFooter>
    </Card>
  );
}
