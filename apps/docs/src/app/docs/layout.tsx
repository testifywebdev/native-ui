import { Logo } from '@/components/logo';
import { SkipNavigationButton } from '@/components/skip-navigation-button';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { ReactNode } from 'react';

const SIDEBAR_PROPS = { className: '[&>div]:pt-3 dark:bg-[#0b0d12]' };

export default function Layout({ children }: { children: ReactNode }) {
  
  return (
    <>
      <SkipNavigationButton />
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: (
            <div className="text-foreground/80 -ml-px flex items-center gap-1.5 opacity-90 transition-opacity duration-200 hover:opacity-100">
              <div className="flex items-center justify-center">
             <Logo />
              </div>
              <p className="text-base font-stretch-extra-condensed font-semibold">Native UI</p>              
            </div>
          ),
        }}
      
        sidebar={SIDEBAR_PROPS}
        githubUrl="https://github.com/founded-labs/react-native-reusables"
        themeSwitch={<ModeToggle />}
        >
        {children}
      </DocsLayout>
    </>
  );
}
