import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

const MANAGERS = ['npm', 'bun', 'pnpm', 'yarn'] as const;

const COMMAND: Record<(typeof MANAGERS)[number], string[]> = {
  npm: ['npx'],
  bun: ['bunx', '--bun'],
  pnpm: ['pnpm', 'dlx'],
  yarn: ['npx'],
};

export function CommandTabs({ args }: { args: string[] }) {
  return (
    <Tabs items={MANAGERS as unknown as string[]} groupId="manager" persist>
      {MANAGERS.map((manager) => (
        <Tab key={manager} value={manager}>
          <CodeBlock>
            <Pre>
              <code className="pl-4">
                {[...COMMAND[manager], 'native-ui@latest', ...args].join(' ')}
              </code>
            </Pre>
          </CodeBlock>
        </Tab>
      ))}
    </Tabs>
  );
}
