// src/commands/list.ts
// ─────────────────────────────────────────────────────────────
// `native-ui list [--category <cat>]`
//
// Reads available components from the static COMPONENTS array.
// Reads installed components from native-ui.json → `components[]`.
// No network call unless --details flag is passed.
// ─────────────────────────────────────────────────────────────

import pc from "picocolors";
import {
  COMPONENTS,
  CATEGORY_LABELS,
  type ComponentCategory,
} from "../registry.js";
import { configExists, readConfig } from "../config.js";
import { logError } from "../utils.js";

interface ListOptions {
  category?: string;
}

export async function listCommand(opts: ListOptions) {
  if (!configExists()) {
    logError("native-ui.json not found. Run `nativeui-cli init` first.");
    process.exit(1);
  }

  const config = readConfig();
  const installedKeys = new Set(config.components); // from native-ui.json

  const filterCat = opts.category?.toLowerCase();
  const keys = filterCat
    ? ([...COMPONENTS] as string[]).filter((k) => k.startsWith(filterCat))
    : [...COMPONENTS];

  if (keys.length === 0) {
    console.log(
      pc.yellow(
        `No components found${filterCat ? ` for category: ${filterCat}` : ""}.`,
      ),
    );
    process.exit(0);
  }

  const installedCount = keys.filter((k) => installedKeys.has(k)).length;

  console.log();
  console.log(
    pc.bgCyan(pc.black("  native-ui  ")) + pc.dim("  available components"),
  );
  console.log();
  console.log(
    `  ${pc.dim("total")}      ${keys.length}` +
      `   ${pc.dim("installed")}  ${pc.green(String(installedCount))}` +
      `   ${pc.dim("available")}  ${keys.length - installedCount}`,
  );
  console.log();

  for (const key of [...keys].sort()) {
    const isInstalled = installedKeys.has(key);
    const status = isInstalled ? pc.green("✔") : pc.dim("○");
    console.log(`  ${status}  ${pc.bold(key)}`);
  }

  console.log();
  console.log(
    pc.dim(
      `  Run ${pc.reset(pc.bold("nativeui-cli add <component>"))} to install a component.`,
    ),
  );
  console.log();
}
