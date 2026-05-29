// src/config.ts
// ─────────────────────────────────────────────────────────────
// Reads and writes `native-ui.json`.
//
// The config stores project settings + the list of components
// the user has installed. That's it — no registry cache, no
// hidden state files.
//
// native-ui.json shape:
// {
//   "$schema": "...",
//   "typescript": true,
//   "outputDir": "components/ui",
//   "expoRunner": "npx",
//   "baseDependencies": ["react-native-reanimated", ...],
//   "components": ["button", "input"]   ← only what the user installed
// }
// ─────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';

export const CONFIG_FILE = 'native-ui.json';

export interface NativeConfig {
  $schema: string;
  typescript: boolean;
  /** Relative path from project root where components are written */
  outputDir: string;
  /** Which Expo runner to use when installing npm packages */
  expoRunner: 'npx' | 'yarn' | 'bunx'| 'pnpm';
  /** Base peer deps installed during `init` */
  baseDependencies: string[];
  /** Keys of components the user has added to this project */
  components: string[];
}

export const DEFAULT_BASE_DEPENDENCIES = [
  'react-native-reanimated',
  'react-native-worklets',
  '@rn-primitives/portal',
];

export const DEFAULT_CONFIG: NativeConfig = {
  $schema: 'https://native-ui.dev/schema.json',
  typescript: true,
  outputDir: 'components/ui',
  expoRunner: 'npx',
  baseDependencies: [...DEFAULT_BASE_DEPENDENCIES],
  components: [],
};

// ─── Path helpers ─────────────────────────────────────────────

export function getConfigPath(): string {
  return path.join(process.cwd(), CONFIG_FILE);
}

export function configExists(): boolean {
  return fs.existsSync(getConfigPath());
}

// ─── Read / write ─────────────────────────────────────────────

export function readConfig(): NativeConfig {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) {
    throw new Error('native-ui.json not found. Run `native-ui init` first.');
  }

  const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<string, unknown>;

  // Migrate legacy `packageManager` → `expoRunner`
  const expoRunner: NativeConfig['expoRunner'] =
    (raw.expoRunner as NativeConfig['expoRunner']) ??
    (raw.packageManager === 'bun' ? 'bunx'
      : raw.packageManager === 'yarn' ? 'yarn'
      : raw.packageManager === 'pnpm' ? 'pnpm'
      : 'npx');

  // Migrate components from old `.native-ui-state.json` if it still exists
  let components: string[] = Array.isArray(raw.components)
    ? (raw.components as string[]).map((k) => k.toLowerCase())
    : [];

  const statePath = path.join(process.cwd(), '.native-ui-state.json');
  if (fs.existsSync(statePath)) {
    try {
      const stateRaw = JSON.parse(fs.readFileSync(statePath, 'utf-8')) as Record<string, unknown>;
      const stateComponents = Array.isArray(stateRaw.components)
        ? (stateRaw.components as string[]).map((k) => k.toLowerCase())
        : [];
      components = [...new Set([...components, ...stateComponents])];
      fs.unlinkSync(statePath); // remove the old state file permanently
    } catch {
      // corrupt state file — ignore
    }
  }

  return {
    $schema: (raw.$schema as string) ?? DEFAULT_CONFIG.$schema,
    typescript: typeof raw.typescript === 'boolean' ? raw.typescript : true,
    outputDir: typeof raw.outputDir === 'string' && raw.outputDir.trim()
      ? raw.outputDir.trim()
      : DEFAULT_CONFIG.outputDir,
    expoRunner,
    baseDependencies: Array.isArray(raw.baseDependencies) && (raw.baseDependencies as string[]).length > 0
      ? (raw.baseDependencies as string[])
      : [...DEFAULT_BASE_DEPENDENCIES],
    components,
  };
}

export function writeConfig(config: NativeConfig): void {
  fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

export function updateConfig(partial: Partial<NativeConfig>): NativeConfig {
  const config = { ...readConfig(), ...partial };
  writeConfig(config);
  return config;
}

// ─── Component tracking (reads/writes native-ui.json) ─────────

export function getInstalledComponents(): string[] {
  return readConfig().components;
}

/** Records a component as installed in native-ui.json. Idempotent. */
export function markInstalled(key: string): void {
  const normalized = key.toLowerCase();
  const config = readConfig();
  if (!config.components.includes(normalized)) {
    config.components = [...config.components, normalized].sort();
    writeConfig(config);
  }
}

/** Removes a component from the installed list in native-ui.json. */
export function unmarkInstalled(key: string): void {
  const normalized = key.toLowerCase();
  const config = readConfig();
  config.components = config.components.filter((k) => k !== normalized);
  writeConfig(config);
}

export function getOutputDir(config: NativeConfig): string {
  return path.join(process.cwd(), config.outputDir);
}
