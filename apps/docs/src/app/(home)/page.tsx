import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <main className="relative z-10 flex flex-1 flex-col items-center px-6 pb-20 pt-10 md:px-12 md:pt-20">
        <section className="flex w-full max-w-6xl flex-col gap-10">
          <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div className="fade-up">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-100/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-white/70">
                <span className="h-2 w-2 rounded-full bg-[#00f5d4]" />
                Built for Expo and Next
              </p>
              <h1
                className="text-4xl font-semibold leading-tight md:text-6xl"
                style={{ fontFamily: '"Sora", "Space Grotesk", sans-serif' }}>
                Ship native-grade interfaces with a design system that feels premium.
              </h1>
              <p className="mt-6 max-w-xl text-base text-slate-600 dark:text-white/70 md:text-lg">
                Native UI gives you animated, accessible, and theme-aware primitives for React Native. Drop
                them into your Expo app and get production-ready UI without rebuilding the wheel.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/docs/installation"
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 dark:bg-white dark:text-[#0b0d12] dark:shadow-[0_12px_40px_rgba(255,255,255,0.25)]">
                  Start building
                </Link>
                <Link
                  href="/docs/components"
                  className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500 hover:text-slate-900 dark:border-white/20 dark:text-white/80 dark:hover:border-white/50 dark:hover:text-white">
                  Browse components
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-white/60">
                <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-white/10">30+ components</span>
                <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-white/10">
                  Theme tokens + dark mode
                </span>
                <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-white/10">Typed API for TS</span>
              </div>
            </div>

            <div className="fade-up delay-1 rounded-3xl border border-slate-200 bg-slate-100/70 p-6 backdrop-blur dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-white/70">Live preview</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-white/10 dark:text-white/60">
                  Themeable
                </span>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0f1219]">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500/70 dark:text-white/40">Select</p>
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <span className="text-sm text-slate-600 dark:text-white/70">Choose a status</span>
                    <span className="rounded-full bg-[#00f5d4] px-3 py-1 text-xs font-semibold text-[#0b0d12]">Live</span>
                  </div>
                  <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 dark:text-white/60">
                    <span className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 dark:border-white/5 dark:bg-white/5">
                      In review
                    </span>
                    <span className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 dark:border-white/5 dark:bg-white/5">
                      Approved
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0f1219]">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500/70 dark:text-white/40">Toast</p>
                  <div className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f15bb5]" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Theme updated</p>
                      <p className="text-xs text-slate-600 dark:text-white/60">Dark mode applied across screens</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-up delay-2 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Motion that feels native',
                copy: 'Spring-driven animations and gestures make every interaction feel tactile and responsive.',
              },
              {
                title: 'Batteries included',
                copy: 'Install via CLI and get tokens, icons, and utilities wired for Expo projects.',
              },
              {
                title: 'Composable by default',
                copy: 'Primitives are small, typed, and flexible so you can build your own UI language.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-100/70 p-6 dark:border-white/10 dark:bg-white/5">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-white/60">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="fade-up delay-3 mt-20 w-full max-w-6xl rounded-3xl border border-slate-200 bg-slate-100/70 p-10 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="text-3xl font-semibold">Designed for teams shipping fast</h2>
              <p className="mt-4 text-sm text-slate-600 dark:text-white/65">
                Native UI keeps your product and engineering teams aligned with a single source of truth for
                color, typography, spacing, and layout. Switch themes in seconds and keep every surface
                consistent.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-600 dark:border-white/10 dark:text-white/60">
                  ThemeProvider
                </span>
                <span className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-600 dark:border-white/10 dark:text-white/60">
                  PortalHost
                </span>
                <span className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-600 dark:border-white/10 dark:text-white/60">
                  Tokens API
                </span>
                <span className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-600 dark:border-white/10 dark:text-white/60">
                  Dark + light
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#0f1219]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500/70 dark:text-white/40">Quick setup</p>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-100 dark:bg-black/40 dark:text-white/70">
                <code>
                  npx native-ui@latest init
                  {'\n'}
                  npx native-ui@latest add button input select
                  {'\n'}
                  {'\n'}
                  import Button from '@/components/ui/button';
                  {'\n'}
                  import Select from '@/components/ui/select';
                </code>
              </pre>
              <Link
                href="/docs/installation"
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 transition hover:text-slate-900 dark:text-[#00f5d4] dark:hover:text-white">
                Full install guide
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 px-6 py-8 text-center text-xs text-slate-500 dark:border-white/10 dark:text-white/50 md:px-12">
        Build with confidence. Explore the{' '}
        <Link href="/docs" className="font-medium text-slate-700 hover:text-slate-900 dark:text-white/70 dark:hover:text-white">
          Native UI documentation
        </Link>
        .
      </footer>

    
    </>
  );
}
