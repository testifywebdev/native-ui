'use client';

import { PlatformSelect, usePlatform } from '@/components/platform-select';
import { useParams } from 'next/navigation';
import Script from 'next/script';
import * as React from 'react';

const EXPO_USERNAME = 'testifywebdev'; 

type PreviewCardProps = {
  preview?: React.ReactNode;
};

export function PreviewCard({ preview }: PreviewCardProps) {
  const isDark = useIsDarkMode();
  const params = useParams<{ slug: string[] }>();
  const [platform] = usePlatform();

  const component = params?.slug?.at(-1) ?? '';

  return (
    <>
    <div className="group/copy bg-card not-prose relative flex min-h-[500px] flex-col rounded-md border p-1">
        
        {/* PlatformSelect will now be visible above the card on screens sm and larger */}
        <div className="absolute -top-11 right-0 mt-px hidden items-center justify-end sm:flex">
          <PlatformSelect />
        </div>

        {/* Inner container still has overflow-hidden to keep the iframe neatly rounded */}
        <div className="flex flex-1 flex-col items-center justify-center w-full h-full rounded-sm overflow-hidden">
          {platform === 'web' ? (
            <iframe
              src={`https://showcase.nativeui.qzz.io/components/${component}`}
              className="w-full h-full min-h-[480px] border-none bg-background"
              title={`${component} web preview`}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : platform === 'native' ? (
  <>
    <div
      key={platform}
      data-snack-id="@testifywebdev/showcase-native-ui"
      data-snack-platform="android"
      data-snack-preview="true"
      data-snack-theme={isDark ? 'dark' : 'light'}
      style={{
        overflow: 'hidden',
        background: '#fbfcfd',
        border: '1px solid var(--color-border)',
        borderRadius: '4px',
        height: '505px',
        width: '100%',
      }}
    />

    <Script
      src="https://snack.expo.dev/embed.js"
      strategy="afterInteractive"
    />
  </>
): (
            preview
          )}
        </div>
      </div>

      {/* Mobile fallback */}
      <a
        href={`https://showcase.nativeui.qzz.io/components/${component}`}
        target="_blank"
        rel="noreferrer"
        className="not-prose bg-primary text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 mt-4 inline-flex w-full shrink-0 items-center gap-2.5 rounded-lg p-2.5 text-sm font-medium shadow-sm outline-none transition-all focus-visible:ring-[3px] sm:hidden dark:p-2 [&_svg]:shrink-0"
      >
        <div className="bg-primary flex items-center justify-center rounded-lg p-1 shadow-md dark:bg-black dark:p-2">
        </div>
        <div className="flex flex-col gap-1">
          <p className="leading-none">Tap to preview in the browser</p>
          <p className="text-[1.3rem] font-semibold leading-none">Native UI</p>
        </div>
      </a>
      </>
  );
}

// ─── SSR-safe dark mode detection ────────────────────────────────────────────
// Reads the `dark` class on <html> and watches for changes via MutationObserver.
// Initialises to `false` on the server to avoid hydration mismatches.


export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const html = document.documentElement;

    const update = () => setIsDark(html.classList.contains('dark'));
    update();

    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  return isDark;
}