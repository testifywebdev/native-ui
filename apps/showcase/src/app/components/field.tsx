import {
  FieldSet,
  FieldLegend,
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';
import Input from '@/components/ui/input';

export default function FieldDemo() {
  return (
    <FieldSet>
      <FieldLegend>Personal Information</FieldLegend>
      <FieldGroup>
        <Field error="Name is required">
          <FieldLabel>Full Name</FieldLabel>
          <Input placeholder="John Doe" />
          <FieldError />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input placeholder="john@example.com" inputMode="email" />
          <FieldDescription>We'll never share your email.</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
