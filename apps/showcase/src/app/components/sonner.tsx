import { Toaster, toast } from '@/components/ui/sonner';
import Button from '@/components/ui/button';


export default function SonnerDemo() {
  return (
    <>
      <Toaster />
      <Button
        title="Show Toast"
        onPress={() => toast.success('Profile updated!', {
          description: 'Your changes have been saved.',
        })}
      />
    </>
  );
}
