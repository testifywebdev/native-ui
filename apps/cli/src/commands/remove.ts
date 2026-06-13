// src/commands/remove.ts
// ─────────────────────────────────────────────────────────────
// `native-ui remove [components...]`
//
// Removes local component files and updates native-ui.json.
// ─────────────────────────────────────────────────────────────

import { intro, outro, multiselect, confirm, log } from "@clack/prompts";
import pc from "picocolors";
import fs from "fs";
import path from "path";
import {
  getInstalledComponents,
  unmarkInstalled,
  configExists,
  readConfig,
} from "../config.js";
import {
  fetchRegistryEntries,
  logError,
  logSuccess,
  logWarn,
  resolveComponentDest,
} from "../utils.js";

export async function removeCommand(componentArgs: string[]) {
  intro(pc.bgCyan(pc.black("  native-ui  ")) + pc.dim("  remove components"));

  // ── Config guard ────────────────────────────────────────────
  if (!configExists()) {
    logError("No native-ui.json found. Run `nativeui-cli init` first.");
    process.exit(1);
  }

  const installedKeys = getInstalledComponents();
  const config = readConfig();

  if (installedKeys.length === 0) {
    log.info("No components are installed.");
    process.exit(0);
  }

  const installedEntries = new Map(
    (await fetchRegistryEntries(installedKeys)).map((entry) => [
      entry.key.toLowerCase(),
      entry,
    ]),
  );

  // ── Resolve which to remove ──────────────────────────────────
  let selectedKeys: string[];

  if (componentArgs.length > 0) {
    selectedKeys = componentArgs.map((c) => c.toLowerCase());
    const unknown = selectedKeys.filter((k) => !installedEntries.has(k));
    if (unknown.length) {
      logError(`Unknown component(s): ${unknown.join(", ")}`);
      process.exit(1);
    }
    const notInstalled = selectedKeys.filter((k) => !installedKeys.includes(k));
    if (notInstalled.length) {
      logWarn(
        `Not installed: ${notInstalled.map((k) => installedEntries.get(k)?.title ?? k).join(", ")}`,
      );
    }
    selectedKeys = selectedKeys.filter((k) => installedKeys.includes(k));
  } else {
    const installed = installedKeys.filter((k) => installedEntries.has(k));
    const selected = await multiselect({
      message: "Which components do you want to remove?",
      options: installed.map((key) => ({
        value: key,
        label:
          pc.bold(installedEntries.get(key)?.title ?? key) +
          pc.dim(` — ${installedEntries.get(key)?.description ?? ""}`),
      })),
      required: true,
    });
    if (typeof selected === "symbol") {
      log.info("Cancelled.");
      process.exit(0);
    }
    selectedKeys = selected as string[];
  }

  if (selectedKeys.length === 0) {
    log.info("Nothing to remove.");
    process.exit(0);
  }

  const selectedEntries = new Map(
    (await fetchRegistryEntries(selectedKeys)).map((entry) => [
      entry.key.toLowerCase(),
      entry,
    ]),
  );

  // ── Confirm ──────────────────────────────────────────────────
  const names = selectedKeys
    .map((k) => selectedEntries.get(k)?.title ?? k)
    .join(", ");
  const ok = await confirm({
    message: `Remove ${pc.bold(names)}? This deletes the local file(s).`,
    initialValue: false,
  });
  if (!ok || typeof ok === "symbol") {
    log.info("Aborted.");
    process.exit(0);
  }

  // ── Delete files & update config ─────────────────────────────
  for (const key of selectedKeys) {
    const comp = selectedEntries.get(key);
    const filePath = resolveComponentDest(comp?.files?.[0], config, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logSuccess(`Removed ${comp?.title ?? key} (${filePath})`);
    } else {
      logWarn(`${comp?.title ?? key}: file not found at ${filePath}`);
    }
  }

  for (const key of selectedKeys) {
    unmarkInstalled(key);
  }

  outro(pc.cyan(`Removed ${selectedKeys.length} component(s).`));
}
