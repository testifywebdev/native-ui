// src/commands/diff.ts
// ─────────────────────────────────────────────────────────────
// `native-ui diff [component]`
//
// Compares installed component files against the registry.
// "Installed" = `native-ui.json → components[]`
// Available component keys come from the static COMPONENTS array.
// ─────────────────────────────────────────────────────────────

import { intro, outro, spinner, log, select } from "@clack/prompts";
import pc from "picocolors";
import path from "path";
import { configExists, readConfig } from "../config.js";
import {
  fetchRegistryEntries,
  readFileSafe,
  isUpToDate,
  lineDiff,
  logError,
  logSuccess,
  logWarn,
  resolveComponentDest,
} from "../utils.js";
import { COMPONENTS, entryName } from "../registry.js";

export async function diffCommand(componentArg?: string) {
  intro(pc.bgCyan(pc.black("  native-ui  ")) + pc.dim("  diff"));

  if (!configExists()) {
    logError("native-ui.json not found. Run `nativeui-cli init` first.");
    process.exit(1);
  }

  const config = readConfig();

  // ── Decide which components to check ────────────────────────

  let keysToCheck: string[];

  if (componentArg) {
    const key = componentArg.toLowerCase();
    if (!(COMPONENTS as readonly string[]).includes(key)) {
      logError(
        `Unknown component: ${componentArg}. Run \`nativeui-cli list\` to see available components.`,
      );
      process.exit(1);
    }
    if (!config.components.includes(key)) {
      logError(
        `${componentArg} is not installed. Run \`nativeui-cli add ${key}\` first.`,
      );
      process.exit(1);
    }
    keysToCheck = [key];
  } else {
    keysToCheck = config.components; // everything in native-ui.json
    if (keysToCheck.length === 0) {
      log.info("No components installed yet. Run `nativeui-cli add` first.");
      process.exit(0);
    }
  }

  // ── Fetch remote versions ────────────────────────────────────

  const s = spinner();
  s.start(`Fetching ${keysToCheck.length} component(s) from registry…`);

  let registryEntries: Awaited<ReturnType<typeof fetchRegistryEntries>>;
  try {
    registryEntries = await fetchRegistryEntries(keysToCheck);
    s.stop("");
  } catch (err) {
    s.stop(pc.red("Fetch failed."));
    logError((err as Error).message);
    process.exit(1);
  }

  const entryMap = new Map(
    registryEntries.map((e) => [e.key.toLowerCase(), e]),
  );

  // ── Compare local vs remote ──────────────────────────────────

  type DiffResult =
    | { key: string; status: "upToDate" }
    | { key: string; status: "missing" }
    | { key: string; status: "changed"; diff: string }
    | { key: string; status: "error"; err: string };

  const results: DiffResult[] = [];

  for (const key of keysToCheck) {
    const entry = entryMap.get(key);
    if (!entry) {
      results.push({ key, status: "error", err: "Not found in registry." });
      continue;
    }

    const file = entry.files?.[0];
    const localPath = resolveComponentDest(file, config, key);
    const localContent = readFileSafe(localPath);

    if (localContent === null) {
      results.push({ key, status: "missing" });
      continue;
    }

    const remoteContent = file?.content;
    if (typeof remoteContent !== "string") {
      results.push({
        key,
        status: "error",
        err: "Registry returned no file content.",
      });
      continue;
    }

    results.push(
      isUpToDate(localContent, remoteContent)
        ? { key, status: "upToDate" }
        : {
            key,
            status: "changed",
            diff: lineDiff(localContent, remoteContent),
          },
    );
  }

  // ── Print results ─────────────────────────────────────────────

  console.log();

  for (const r of results) {
    const name = entryName(entryMap.get(r.key) ?? { key: r.key });
    if (r.status === "upToDate") logSuccess(`${name} — up to date`);
    if (r.status === "missing")
      logWarn(
        `${name} — local file missing. Re-add: nativeui-cli add ${r.key}`,
      );
    if (r.status === "error")
      logError(
        `${name} — ${(r as { key: string; status: "error"; err: string }).err}`,
      );
  }

  const changed = results.filter(
    (r): r is { key: string; status: "changed"; diff: string } =>
      r.status === "changed",
  );

  if (changed.length === 0) {
    console.log();
    log.info(pc.green("All components are up to date!"));
  } else {
    console.log();
    log.warn(
      pc.yellow(`${changed.length} component(s) have updates available:`),
    );
    console.log();

    for (const r of changed) {
      const entry = entryMap.get(r.key);
      const file = entry?.files?.[0];
      console.log(
        pc.bold(`── ${entryName(entry ?? { key: r.key })} `) +
          pc.dim(`(${file?.target ?? file?.path ?? r.key})`) +
          pc.bold(" ──"),
      );
      console.log(r.diff);
      console.log();
    }

    const choice = await select({
      message: "What would you like to do?",
      options: [
        {
          value: "update-all",
          label: `Update all ${changed.length} component(s)`,
        },
        { value: "skip", label: "Skip — I will update manually" },
      ],
    });

    if (choice === "update-all") {
      const { addCommand } = await import("./add.js");
      await addCommand(
        changed.map((r) => r.key),
        { overwrite: true },
      );
      return;
    }
  }

  outro(pc.cyan("Diff complete."));
}
