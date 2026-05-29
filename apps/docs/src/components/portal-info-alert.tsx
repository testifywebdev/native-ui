import { Callout } from '@/components/callout';
import Link from 'next/link';

export function PortalInfoAlert() {
  return (
    <Callout type="warn" title="Portal Setup Required">
      A{' '}
      <Link href="https://rnprimitives.com/portal/" className="hover:underline" target="_blank" rel="noopener noreferrer">
        <code className="bg-muted rounded-sm px-1 py-0.5 text-[0.813rem]">PortalHost</code>
      </Link>{' '}
      must be added at the root of your app to support portal rendering on native platforms. Without
      it, components that rely on portals, like this one, will not render correctly.
    </Callout>
  );
}
