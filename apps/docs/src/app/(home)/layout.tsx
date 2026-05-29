"use client"
import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { HTMLAttributes } from 'react';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import { baseOptions } from '@/lib/layout.shared';
import { Logo } from '@/components/logo';

type ContainerProps = HTMLAttributes<HTMLDivElement>;

function MarketingContainer({ className, ...props }: ContainerProps) {
  return (
    <div
      {...props}
      className={cn(
        'relative flex min-h-screen flex-1 flex-col overflow-hidden bg-white text-slate-900 dark:bg-[#0b0d12] dark:text-white',
        className
      )}
    />
  );
}

function MarketingHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
      <Link href="/">
      <div className="flex items-center gap-3">
      <Logo />
    
        <div className="leading-tight">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-white/60">Native UI</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">React Native, refined</p>
        </div>
      </div>
      </Link>
      <nav className="hidden items-center gap-6 text-sm text-slate-600 dark:text-white/70 md:flex">
        <Link href="/docs" className="transition hover:text-slate-900 dark:hover:text-white">
          Docs
        </Link>
        <Link href="/docs/components" className="transition hover:text-slate-900 dark:hover:text-white">
          Components
        </Link>
        <Link href="/docs/installation" className="transition hover:text-slate-900 dark:hover:text-white">
          Install
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <ModeToggle />
        <Link
          href="/docs"
          className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-white/20 dark:text-white/80 dark:hover:border-white/50 dark:hover:text-white md:inline-flex">
          View docs
        </Link>
        <Link
          href="/docs/installation"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 dark:bg-white dark:text-[#0b0d12] dark:shadow-[0_8px_30px_rgba(255,255,255,0.2)]">
          Get started
        </Link>
      </div>
    </header>
  );
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout
      {...baseOptions()}
      nav={{ component: <MarketingHeader /> }}
      slots={{container: (props) => <MarketingContainer {...props} />  }}>
      {children}
    </HomeLayout>
  );
}
