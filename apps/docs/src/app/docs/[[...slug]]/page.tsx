import { ComponentSource } from '@/components/component-source';
import { Button } from '@/components/ui/button';
import { source } from '@/lib/source';
import { cn } from '@/lib/utils';
import { findNeighbour } from 'fumadocs-core/page-tree';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{ enabled: false }}
      footer={{
        component: <Footer url={page.url} />,
      }}>
      <DocsBody className="bg-white text-slate-900 dark:bg-[#0b0d12] dark:text-white">
        <div className="flex items-center justify-between gap-2">
          <DocsTitle className="mb-0 font-semibold">{page.data.title}</DocsTitle>
          <NeighbourButtons url={page.url} />
        </div>
        <DocsDescription className="mb-4 mt-2.5 text-base text-slate-600 dark:text-white/70">
          {page.data.description}
        </DocsDescription>
        <MDX
          components={{
            ...defaultMdxComponents,
           h2: ({ className, ...props }) => (
              <defaultMdxComponents.h2 
                className={cn(className, 'font-medium text-slate-900 dark:text-white')} 
                {...props} 
              />
            ),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            pre: ({ ref: _ref, className, ...props }) => (
              <CodeBlock
                {...props}
                className={cn(
                  className,
                  'bg-muted/40 text-foreground dark:bg-fd-secondary/50 dark:text-foreground relative'
                )}>
                <Pre>{props.children}</Pre>
              </CodeBlock>
            ),
          h3: ({ className, ...props }) => (
              <h3 
                className={cn(className, 'mb-6 mt-10 scroll-mt-20 font-medium text-slate-900 dark:text-white')} 
                {...props} 
              />
            ),
          ComponentSource
          }
        }
        />
      </DocsBody>
    </DocsPage>
  );
}

function NeighbourButtons({ url }: { url: string }) {
  const neighbours = findNeighbour(source.pageTree, url);

  const isManualInstallation = url === '/docs/installation/manual';

  return (
    <div className="flex items-center gap-2">
      {neighbours.previous || isManualInstallation ? (
        <Button variant="outline" size="icon" className="border-border/70 size-8" asChild>
          <Link href={neighbours.previous?.url || '/docs'}>
            <ArrowLeftIcon />
          </Link>
        </Button>
      ) : null}
      {neighbours.next || isManualInstallation ? (
        <Button variant="outline" size="icon" className="border-border/70 size-8" asChild>
          <Link
            href={neighbours.next?.url || '/docs/customization'}
            target={
              neighbours.next?.url.startsWith('https://foundedlabs.com') ? '_blank' : undefined
            }>
            <ArrowRightIcon />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

export function Footer({ url }: { url: string }) {
  const neighbours = findNeighbour(source.pageTree, url);

  const isManualInstallation = url === '/docs/installation/manual';

  return (
    <footer>
      <div className="flex h-16 w-full items-center justify-between gap-2">
        {neighbours.previous || isManualInstallation ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="bg-fd-accent hover:bg-fd-accent/80 dark:hover:bg-fd-accent/80">
            <Link href={neighbours.previous?.url || '/docs'}>
              <ArrowLeftIcon />
              {neighbours.previous?.name || 'Introduction'}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {neighbours.next || isManualInstallation ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="bg-fd-accent hover:bg-fd-accent/80 dark:hover:bg-fd-accent/80">
            <Link href={neighbours.next?.url || '/docs/customization'}>
              {neighbours.next?.name || 'Customization'}
              <ArrowRightIcon />
            </Link>
          </Button>
        ) : null}
      </div>
      <div className="flex h-20 items-center justify-between">
        <div className="text-fd-muted-foreground w-full text-balance px-4 text-center text-xs leading-loose lg:text-sm">
          Built by{' '}
          <a
            href="https://x.com/kishanag028"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4">
            @kishanag028
          </a>
          , bringing{' '}
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4">
            shadcn/ui 
          </a>{' '}
          api compatible library to React Native. Source on{' '}
          <a
            href="https://github.com/kishan-agarwal-28/native-ui"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4">
            GitHub
          </a>
          .
        </div>
      </div>
    </footer>
  );
}



export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
