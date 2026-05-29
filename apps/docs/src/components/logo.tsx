"use client"
import Image from 'next/image';
import { useIsDarkMode } from '@/components/preview-card';

export function Logo() {
  const isDark = useIsDarkMode();
  return (
    <Image
      src={isDark ? '/logo_dark.png' : '/logo.png'}
      alt="Native UI Logo"
      width={50}
      height={50}
      className="rounded-md p-1.5"
    />
  );
}