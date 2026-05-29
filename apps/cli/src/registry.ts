// src/registry.ts
// ─────────────────────────────────────────────────────────────
// Static list of every component the CLI knows about.
// This is the single source of truth for what can be installed.
// File *contents* are fetched from the GraphQL backend at install time.
// ─────────────────────────────────────────────────────────────

export type ComponentCategory =
  | 'primitives'
  | 'forms'
  | 'navigation'
  | 'feedback'
  | 'layout'
  | 'typography';

export interface RegistryEntry {
  key: string;
  title?: string;
  description?: string;
  category?: ComponentCategory;
  registryDependencies?: string[];
  dependencies?: string[];
  files?: RegistryFile[];
}

export interface RegistryFile {
  path?: string;
  target?: string;
  content?: string;
}

// ─── All available components ─────────────────────────────────
// Add new component keys here — they instantly appear in `add` and `list`.

export const COMPONENTS = [
  'accordion',
  'alert-dialog',
  'alert',
  'aspect-ratio',
  'avatar',
  'badge',
  'button-group',
  'button',
  'calendar',
  'card',
  'carousel',
  'checkbox',
  'date-picker',
  'dialog',
  'empty',
  'field',
  'input-otp',
  'input',
  'label',
  'progress',
  'radio-group',
  'select',
  'separator',
  'skeleton',
  'sonner',
  'spinner',
  'switch',
  'table',
  'textarea',
  'typography',
] as const;

export type ComponentKey = (typeof COMPONENTS)[number];

// ─── Category labels for `list` display ──────────────────────

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  primitives: '◆ Primitives',
  forms:      '◆ Forms',
  navigation: '◆ Navigation',
  feedback:   '◆ Feedback',
  layout:     '◆ Layout',
  typography: '◆ Typography',
};

// ─── Helpers ──────────────────────────────────────────────────

export function entryName(entry: Pick<RegistryEntry, 'key' | 'title'>): string {
  return entry.title ?? entry.key;
}
