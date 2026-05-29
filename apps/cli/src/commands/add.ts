// src/commands/add.ts
// ─────────────────────────────────────────────────────────────
// `native-ui add [components...]`
//
// Available components come from the static COMPONENTS array in
// registry.ts — no network call needed just to show the list.
//
// File contents are fetched from the GraphQL backend only after
// the user has picked what they want.
//
// native-ui.json `components` is updated after each successful write.
// ─────────────────────────────────────────────────────────────

import {
  intro,
  outro,
  multiselect,
  confirm,
  spinner,
  log,
  note,
} from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import { COMPONENTS, entryName } from '../registry.js';
import {
  readConfig,
  markInstalled,
  configExists,
} from '../config.js';
import {
  fetchRegistryClosure,
  writeFile,
  buildInstallCmd,
  installPackages,
  logError,
  logWarn,
  getMissingPackages,
} from '../utils.js';

export async function addCommand(
  componentArgs: string[],
  opts: { overwrite?: boolean; all?: boolean }
) {
  intro(pc.bgCyan(pc.black('  native-ui  ')) + pc.dim('  add components'));

  if (!configExists()) {
    logError('native-ui.json not found. Run `native-ui init` first.');
    process.exit(1);
  }

  const config = readConfig();
  const installedKeys = config.components; // what's already in native-ui.json

  // ── Resolve which components the user wants ──────────────────

  let selectedKeys: string[];

  if (opts.all) {
    selectedKeys = [...COMPONENTS];

  } else if (componentArgs.length > 0) {
    selectedKeys = componentArgs.map((c) => c.toLowerCase());

    const unknown = selectedKeys.filter(
      (k) => !(COMPONENTS as readonly string[]).includes(k)
    );
    if (unknown.length > 0) {
      logError(`Unknown component(s): ${unknown.join(', ')}`);
      log.info(`Run ${pc.bold('native-ui list')} to see all available components.`);
      process.exit(1);
    }

  } else {
    // ── Interactive multiselect — list comes from COMPONENTS ───
    const SELECT_ALL = '__select_all__';

    const options = [
      { value: SELECT_ALL, label: pc.bold('Select all') },
      ...[...COMPONENTS].sort().map((key) => {
        const isInstalled = installedKeys.includes(key);
        return {
          value: key,
          label:
            pc.bold(key.padEnd(28)) +
            (isInstalled ? pc.green('installed') : ''),
        };
      }),
    ];

    const selected = await multiselect({
      message: 'Pick the components to add:',
      options,
      required: true,
    });

    if (typeof selected === 'symbol') {
      log.info('Cancelled.');
      process.exit(0);
    }

    const chosen = selected as string[];
    selectedKeys = chosen.includes(SELECT_ALL) ? [...COMPONENTS] : chosen;
  }

  // ── Overwrite check ──────────────────────────────────────────

  const alreadyInstalled = selectedKeys.filter((k) => installedKeys.includes(k));
  if (alreadyInstalled.length > 0 && !opts.overwrite) {
    logWarn(`Already installed: ${alreadyInstalled.join(', ')}`);
    const overwrite = await confirm({
      message: 'Overwrite existing files?',
      initialValue: false,
    });
    if (typeof overwrite === 'symbol' || !overwrite) {
      selectedKeys = selectedKeys.filter((k) => !alreadyInstalled.includes(k));
    }
  }

  if (selectedKeys.length === 0) {
    log.info('Nothing to install.');
    process.exit(0);
  }

  // ── Fetch file contents + resolve transitive deps ────────────

  const fetchSpin = spinner();
  fetchSpin.start('Fetching components from registry…');

  let closureEntries: Awaited<ReturnType<typeof fetchRegistryClosure>>;
  try {
    closureEntries = await fetchRegistryClosure(selectedKeys);
    fetchSpin.stop('');
  } catch (err) {
    fetchSpin.stop(pc.red('Fetch failed.'));
    logError((err as Error).message);
    process.exit(1);
  }

  const entryMap = new Map(closureEntries.map((e) => [e.key.toLowerCase(), e]));
  const resolvedKeys = closureEntries.map((e) => e.key.toLowerCase());

  // Show auto-added transitive deps
  const addedDeps = resolvedKeys.filter((k) => !selectedKeys.includes(k));
  if (addedDeps.length > 0) {
    note(
      addedDeps.map((k) => `  ${pc.dim('+')} ${entryName(entryMap.get(k)!)}`).join('\n'),
      'Also adding required dependencies'
    );
  }

  // ── Write files ───────────────────────────────────────────────

  const allNpmDeps = new Set<string>();
  type Result = { key: string; dest: string; ok: boolean; err?: string };
  const results: Result[] = [];

  for (const key of resolvedKeys) {
    const entry = entryMap.get(key)!;
    const file = entry.files?.[0];
    const content = file?.content;

    if (typeof content !== 'string') {
      results.push({ key, dest: '', ok: false, err: 'No file content in registry response.' });
      continue;
    }

    const dest = path.resolve(process.cwd(), file?.target ?? file?.path ?? key);

    try {
      writeFile(dest, content);
      (entry.dependencies ?? []).forEach((d) => allNpmDeps.add(d));
      markInstalled(key);  // ← writes key into native-ui.json `components[]`
      results.push({ key, dest, ok: true });
    } catch (err) {
      results.push({ key, dest, ok: false, err: String(err) });
    }
  }

  // ── Print results (shadcn style: name → path) ─────────────────

  for (const r of results) {
    const name = entryName(entryMap.get(r.key) ?? { key: r.key });
    if (r.ok) {
      log.success(`${pc.green(name)} → ${pc.dim(r.dest)}`);
    } else {
      log.error(`${pc.red(name)}: ${r.err}`);
    }
  }

 // ── Install npm deps ──────────────────────────────────────────

  if (allNpmDeps.size > 0) {
    const depList = [...allNpmDeps];
    
    // Filter out packages already present in package.json
    const missingDeps = getMissingPackages(depList, process.cwd());

    if (missingDeps.length === 0) {
      log.success(pc.green('All required dependencies are already installed.'));
    } else {
      const ds = spinner();
      ds.start(`Installing ${missingDeps.join(', ')}…`);
      
      const ok = await installPackages(
        missingDeps,
        config.expoRunner,
        process.cwd(),
        (pkg, i, total) =>
          log.message(pc.dim(`Installing ${pkg} (${i + 1}/${total})…`))
      );
      
      if (ok) {
        ds.stop(pc.green(`Installed ${missingDeps.join(', ')}`));
      } else {
        ds.stop(pc.yellow('Dependency install failed. Run manually:'));
        log.message(pc.dim(`  ${buildInstallCmd(config.expoRunner, missingDeps)}`));
      }
    }
  }

  const failed = results.filter((r) => !r.ok);
  outro(
    failed.length === 0
      ? pc.cyan(`${results.length} component(s) added successfully.`)
      : pc.yellow(`Done with ${failed.length} error(s).`)
  );
}
