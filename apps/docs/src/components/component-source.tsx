import { codeToHtml } from "shiki";
import { CodeBlockWrapper } from "@/components/code-block";

const GRAPHQL_ENDPOINT = 'https://cdn.nativeui.qzz.io/graphql';

export async function ComponentSource({ name }: { name: string }) {
  let rawCode = "";

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
    next: { revalidate: 172800 },
      body: JSON.stringify({
        query: `
          query Registry($key: String!) {
            registry(key: $key) {
              files {
                content
              }
            }
          }
        `,
        variables: { key: name.toLowerCase() }
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.errors?.length) throw new Error(payload.errors[0].message);

    const content = payload.data?.registry?.files?.[0]?.content;
    if (!content) throw new Error("Component content not found in registry.");

    rawCode = content;
  } catch (error: any) {
    return (
      <div className="my-6 p-4 rounded-xl border border-destructive bg-destructive/10 text-destructive text-sm">
        Failed to load source for <strong>{name}</strong>: {error.message}
      </div>
    );
  }

  const [lightHtml, darkHtml] = await Promise.all([
    codeToHtml(rawCode, { lang: "tsx", theme: "github-light" }),
    codeToHtml(rawCode, { lang: "tsx", theme: "github-dark" }),
  ]);

  const lineCount = rawCode.split(/\r\n|\r|\n/).length;
  const isCollapsible = lineCount > 50; 

  return (
    <div className="relative my-6 flex flex-col overflow-hidden rounded-xl border border-border bg-muted/40 text-foreground shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-muted-foreground/40" />
          <div className="h-3 w-3 rounded-full bg-muted-foreground/40" />
          <div className="h-3 w-3 rounded-full bg-muted-foreground/40" />
        </div>
        <span className="ml-4 text-xs font-mono text-muted-foreground">{name}.tsx</span>
      </div>
      <CodeBlockWrapper isCollapsible={isCollapsible}>
        <div 
          className={
            "p-4 overflow-x-auto text-sm [&_pre]:bg-transparent! [&_code]:bg-transparent! [&_pre]:m-0! **:border-none! " + 
            (isCollapsible ? "pb-12" : "")
          }
        >
          <div className="block dark:hidden" dangerouslySetInnerHTML={{ __html: lightHtml }} />
          <div className="hidden dark:block" dangerouslySetInnerHTML={{ __html: darkHtml }} />
        </div>
      </CodeBlockWrapper>

    </div>
  );
}