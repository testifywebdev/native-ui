// src/utils.ts

import { log } from '@clack/prompts';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';
import spawn from 'cross-spawn';
import { type ChildProcess } from 'child_process';
import type { NativeConfig } from './config.js';
const GRAPHQL_ENDPOINT = 'https://cdn.nativeui.qzz.io/graphql';

type RegistryFile = {
  path?: string;
  target?: string;
  content?: string;
};

type RegistryManifest = {
  title?: string;
  description?: string;
  registryDependencies?: string[];
  dependencies?: string[];
  category?: string;
  files?: RegistryFile[];
};

type RegistryEntry = RegistryManifest & { key: string };

async function postGraphQL<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch registry data from GraphQL (HTTP ${response.status})`
    );
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message?: string }>;
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message ?? 'GraphQL request failed');
  }

  if (!payload.data) {
    throw new Error('GraphQL response did not include data');
  }

  return payload.data;
}

export async function fetchRegistryEntries(
  keys: string[]
): Promise<RegistryEntry[]> {
  const uniqueKeys = [...new Set(keys.map((key) => key.toLowerCase()))];
  if (uniqueKeys.length === 0) return [];

  if (uniqueKeys.length === 1) {
    const data = await postGraphQL<{ registry?: RegistryEntry | null }>(
      `
        query Registry($key: String!) {
          registry(key: $key) {
            key
            title
            description
            registryDependencies
            dependencies
            category
            files {
              path
              target
              content
            }
          }
        }
      `,
      { key: uniqueKeys[0] }
    );

    return data.registry ? [data.registry] : [];
  }

  const data = await postGraphQL<{ registries?: RegistryEntry[] }>(
    `
      query Registries($keys: [String!]!) {
        registries(keys: $keys) {
          key
          title
          description
          registryDependencies
          dependencies
          category
          files {
            path
            target
            content
          }
        }
      }
    `,
    { keys: uniqueKeys }
  );

  return data.registries ?? [];
}

export async function fetchRegistryIndex(): Promise<string[]> {
  const data = await postGraphQL<{ registries?: Array<{ key?: string }> }>(
    `
      query Registries {
        registries {
          key
        }
      }
    `,
    {}
  );

  return (data.registries ?? [])
    .map((entry) => entry.key?.toLowerCase())
    .filter((key): key is string => Boolean(key));
}

export async function fetchRegistryClosure(
  keys: string[]
): Promise<RegistryEntry[]> {
  const resolved = new Map<string, RegistryEntry>();
  const queue = [...new Set(keys.map((key) => key.toLowerCase()))];

  while (queue.length > 0) {
    const batch = queue.splice(0, queue.length).filter((key) => !resolved.has(key));
    if (batch.length === 0) break;

    const fetched = await fetchRegistryEntries(batch);
    for (const entry of fetched) {
      const normalizedKey = entry.key.toLowerCase();
      if (!resolved.has(normalizedKey)) {
        resolved.set(normalizedKey, { ...entry, key: normalizedKey });
      }
    }

    for (const entry of fetched) {
      for (const dep of entry.registryDependencies ?? []) {
        const normalizedDep = dep.toLowerCase();
        if (!resolved.has(normalizedDep)) {
          queue.push(normalizedDep);
        }
      }
    }
  }

  return [...resolved.values()];
}

// ─── Logging helpers ──────────────────────────────────────────

export function logSuccess(msg: string) {
  log.success(pc.green(msg));
}

export function logError(msg: string) {
  log.error(pc.red(msg));
}

export function logWarn(msg: string) {
  log.warn(pc.yellow(msg));
}

export function logInfo(msg: string) {
  log.info(pc.cyan(msg));
}

/** Print a labelled key → value pair (used in `init` summary). */
export function logKV(key: string, value: string) {
  log.message(`${pc.dim(key.padEnd(18))} ${pc.white(value)}`);
}

// ─── Fetch helpers ───────────────────────────────────────────

/**
 * Fetches the raw source of a component from its registry URL.
 * Throws a descriptive error on non-200 responses.
 */
export async function fetchComponent(
  name: string,
  url: string
): Promise<string> {
  try {
    const [manifest] = await fetchRegistryEntries([url || name]);
    const content = manifest?.files?.[0]?.content;
    if (typeof content === 'string') return content;
    throw new Error(
      `Registry response for ${name} did not include file content`
    );
  } catch (err) {
    throw new Error(`Network error fetching ${name}: ${(err as Error).message}`);
  }
}

// ─── File helpers ─────────────────────────────────────────────

/** Ensures a directory exists, creating it recursively if needed. */
export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Writes text to a file, creating parent dirs as needed. */
export function writeFile(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
}

/** Returns file content or null if the file doesn't exist. */
export function readFileSafe(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

// ─── Package manager helpers ──────────────────────────────────

/** Returns the install command for the given package manager. */
export function buildInstallCmd(
  runner: NativeConfig['expoRunner'],
  packages: string[]
): string {
  const list = packages.join(' ');
  if (runner === 'npx') return `npm exec --yes expo install ${list}`;
  return `${runner} expo install ${list}`;
}


// 1. Track active process and cancellation state
let activeInstallProcess: ChildProcess | null = null;
let isCancelled = false;

function runInstallCommand(
  runner: NativeConfig['expoRunner'],
  packages: string[], // <-- Now takes an array of packages
  cwd: string
): Promise<boolean> {
  const command = runner === 'npx' ? 'npx' : runner;
  
  // Pass all packages at once: `expo install pkg1 pkg2 pkg3`
  const args = ['expo', 'install', ...packages];

  return new Promise((resolve) => {
    activeInstallProcess = spawn(command, args, {
      stdio: 'inherit',
      cwd,
    });

    activeInstallProcess.on('error', () => {
      activeInstallProcess = null;
      resolve(false);
    });
    
    activeInstallProcess.on('exit', (code) => {
      activeInstallProcess = null;
      // If cancelled by the user, return false to prevent success messages
      resolve(code === 0 && !isCancelled);
    });
  });
}

/**
 * Installs Expo packages in a single batched command.
 * Returns true on success, false on failure.
 */
export function installPackages(
  packages: string[],
  runner: NativeConfig['expoRunner'],
  cwd: string,
  onProgress?: (pkg: string, index: number, total: number) => void
): boolean {                                  // ← sync now, no Promise
  if (packages.length === 0) return true;

  const command = runner === 'npx' ? 'npx' : runner;
  const args = ['expo', 'install', ...packages];

  onProgress?.(`${packages.length} dependencies`, 0, 1);

  // spawnSync + stdio:'inherit' puts node and the child in the same
  // foreground process group. Ctrl+C from the terminal goes to both
  // simultaneously — the OS handles it, no SIGINT wrangling needed.
const result = spawn.sync(command, args, {
  stdio: 'inherit',
  cwd,
  // no shell:true needed — cross-spawn resolves .cmd files itself
});

  return result.status === 0;
}
/** Detect which Expo runner should be used in the cwd. */
export function detectExpoRunner(): NativeConfig['expoRunner'] {
  if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(process.cwd(), 'bun.lockb'))) return 'bunx';
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) return 'yarn';
  return 'npx';
}

/** Returns true if this looks like an Expo project. */
export function isExpoProject(): boolean {
  return fs.existsSync(path.join(process.cwd(), 'app.json'));
}

// ─── Diff helpers ─────────────────────────────────────────────

/**
 * Very minimal line diff — returns a coloured unified-diff-style string.
 * For a production CLI you'd swap this for the `diff` package.
 */
export function lineDiff(a: string, b: string): string {
  const aLines = a.split('\n');
  const bLines = b.split('\n');

  const maxLen = Math.max(aLines.length, bLines.length);
  const output: string[] = [];

  for (let i = 0; i < maxLen; i++) {
    const aLine = aLines[i];
    const bLine = bLines[i];

    if (aLine === undefined) {
      output.push(pc.green(`+ ${bLine}`));
    } else if (bLine === undefined) {
      output.push(pc.red(`- ${aLine}`));
    } else if (aLine !== bLine) {
      output.push(pc.red(`- ${aLine}`));
      output.push(pc.green(`+ ${bLine}`));
    } else {
      output.push(pc.dim(`  ${aLine}`));
    }
  }

  return output.join('\n');
}

/** Returns true if two strings are identical (ignoring line-ending differences). */
export function isUpToDate(a: string, b: string): boolean {
  return a.replace(/\r\n/g, '\n') === b.replace(/\r\n/g, '\n');
}
// Add this helper function below `isExpoProject` or anywhere in the Package Manager helpers section.

/** Extracts the base package name, ignoring version tags (e.g., "pkg@1.0" -> "pkg", "@scope/pkg@latest" -> "@scope/pkg") */
function getPackageName(pkg: string): string {
  const match = pkg.match(/^(@[^\/]+\/[^@]+|[^@]+)/);
  return match ? match[1] : pkg;
}

/** * Reads package.json and returns only the packages that are NOT currently installed.
 */
export function getMissingPackages(packages: string[], cwd: string): string[] {
  const pkgJsonPath = path.join(cwd, 'package.json');
  
  if (!fs.existsSync(pkgJsonPath)) {
    return packages; // If no package.json is found, assume we need to install everything
  }

  try {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    const allInstalledDeps = {
      ...(pkgJson.dependencies || {}),
      ...(pkgJson.devDependencies || {}),
      ...(pkgJson.peerDependencies || {}),
    };

    return packages.filter((pkg) => {
      const name = getPackageName(pkg);
      return !allInstalledDeps[name];
    });
  } catch (err) {
    // If parsing fails, default to installing everything to be safe
    return packages;
  }
}