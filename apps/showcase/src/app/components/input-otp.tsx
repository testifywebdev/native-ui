import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useState } from 'react';
import { Text } from 'react-native';

export default function InputOTPDemo() {
  const [value, setValue] = useState('');

  return (
    <>
    <Text style={{ fontWeight: '600' }}>Enter your OTP</Text>
    <InputOTP maxLength={6} value={value} onChangeText={setValue}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
    </>
  );
}
