#!/usr/bin/env node
// src/index.ts
// ─────────────────────────────────────────────────────────────
// Entry point. Wires up all commands via Commander.
//
// Usage:
//   native-ui init
//   native-ui add [components...]
//   native-ui remove [components...]
//   native-ui list [--category <cat>]
//   native-ui diff [component]
// ─────────────────────────────────────────────────────────────

import { Command } from 'commander';
import pc from 'picocolors';
import { createRequire } from 'module';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { removeCommand } from './commands/remove.js';
import { listCommand } from './commands/list.js';
import { diffCommand } from './commands/diff.js';

// Read version from package.json at runtime
const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { version: string };

const program = new Command();

program
  .name('native-ui')
  .description(
    pc.cyan('Add beautiful React Native / Expo components to your project.')
  )
  .version(pkg.version, '-v, --version', 'Display the current version');

// ─── init ─────────────────────────────────────────────────────
program
  .command('init')
  .description('Initialise native-ui in your project')
  .option('-y, --yes', 'Skip all prompts and use defaults')
  .option('-f, --force', 'Overwrite existing native-ui.json')
  .action(async (opts: { yes?: boolean; force?: boolean }) => {
    await initCommand(opts);
  });

// ─── add ──────────────────────────────────────────────────────
program
  .command('add [components...]')
  .description('Add one or more components to your project')
  .option('-o, --overwrite', 'Overwrite existing files without prompting')
  .option('-a, --all', 'Add every available component')
  .action(
    async (
      components: string[],
      opts: { overwrite?: boolean; all?: boolean }
    ) => {
      await addCommand(components, opts);
    }
  );

// ─── remove ───────────────────────────────────────────────────
program
  .command('remove [components...]')
  .alias('rm')
  .description('Remove installed components')
  .action(async (components: string[]) => {
    await removeCommand(components);
  });

// ─── list ─────────────────────────────────────────────────────
program
  .command('list')
  .alias('ls')
  .description('List all available components')
  .option(
    '-c, --category <category>',
    'Filter by category (primitives, forms, navigation, feedback, layout, typography)'
  )
  .action(async (opts: { category?: string }) => {
    await listCommand(opts);
  });

// ─── diff ─────────────────────────────────────────────────────
program
  .command('diff [component]')
  .description(
    'Show differences between your local files and the registry'
  )
  .action(async (component?: string) => {
    await diffCommand(component);
  });

// ─── Global error handler ─────────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error(pc.red(`\n  Error: ${err.message}\n`));
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(pc.red(`\n  Unhandled rejection: ${reason}\n`));
  process.exit(1);
});

program.parse(process.argv);

// Show help if no command given
if (!process.argv.slice(2).length) {
  program.outputHelp();
}