import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { CookiesProvider } from '@/components/cookies-provider';
import { SearchLink } from 'fumadocs-ui/contexts/search';
const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  const SEARCH_OPTIONS = {
  links: [
    ['Docs', '/docs/installation'],
    ['Components', '/docs/components/accordion'],
  ] satisfies SearchLink[],
};

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
    <body className="bg-white text-slate-900 dark:bg-[#0b0d12] dark:text-white min-h-screen">
        <RootProvider search={SEARCH_OPTIONS}>
          <ThemeProvider
            defaultTheme="system"
          >
            <CookiesProvider>
          {children}
            </CookiesProvider>
          </ThemeProvider>
          </RootProvider>
      </body>
    </html>
  );
}
