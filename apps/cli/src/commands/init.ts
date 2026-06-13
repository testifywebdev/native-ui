// src/commands/init.ts
// ─────────────────────────────────────────────────────────────
// `native-ui init`
//
// Creates native-ui.json with project settings.
// No registry fetch needed — component list is static in registry.ts.
// ─────────────────────────────────────────────────────────────

import {
  intro,
  outro,
  confirm,
  select,
  text,
  spinner,
  log,
  note,
} from "@clack/prompts";
import pc from "picocolors";
import path from "path";
import {
  configExists,
  readConfig,
  writeConfig,
  markInstalled,
  DEFAULT_CONFIG,
  DEFAULT_BASE_DEPENDENCIES,
  type NativeConfig,
} from "../config.js";
import {
  fetchRegistryEntries,
  detectExpoRunner,
  buildInstallCmd,
  installPackages,
  isExpoProject,
  logWarn,
  writeFile,
  getMissingPackages, // <-- ADDED THIS
} from "../utils.js";
import { COMPONENTS } from "../registry.js";

export async function initCommand(opts: { yes?: boolean; force?: boolean }) {
  intro(pc.bgCyan(pc.black("  native-ui  ")) + pc.dim("  initialise project"));
  const projectRoot = process.cwd();

  // ── Already initialised? ────────────────────────────────────
  if (configExists() && !opts.force) {
    const overwrite = await confirm({
      message: "native-ui.json already exists. Overwrite it?",
      initialValue: false,
    });
    if (!overwrite || typeof overwrite === "symbol") {
      log.info("Init cancelled — existing config preserved.");
      process.exit(0);
    }
  }

  // ── Expo project check ──────────────────────────────────────
  if (!isExpoProject()) {
    logWarn("No app.json found — this does not look like an Expo project.");
    const proceed = await confirm({
      message: "Continue anyway?",
      initialValue: false,
    });
    if (!proceed || typeof proceed === "symbol") process.exit(0);
  }

  // ── Preserve already-installed components across re-init ─────
  let existingComponents: string[] = [];
  if (configExists()) {
    try {
      existingComponents = readConfig().components;
    } catch {
      /* fresh install */
    }
  }

  let config: NativeConfig = {
    ...DEFAULT_CONFIG,
    components: existingComponents,
  };

  if (!opts.yes) {
    const useTs = await confirm({
      message: "Are you using TypeScript?",
      initialValue: true,
    });
    if (typeof useTs === "symbol") process.exit(0);
    config.typescript = useTs as boolean;

    const outputDir = await text({
      message: "Where should components be installed?",
      initialValue: config.outputDir,
      placeholder: "components/ui",
      validate: (v) => (!v || !v.trim() ? "Path cannot be empty." : undefined),
    });
    if (typeof outputDir === "symbol") process.exit(0);
    config.outputDir = (outputDir as string).trim();

    const runner = (await select({
      message: "Which command runs Expo?",
      options: [
        { value: "npx", label: "npx expo  (npm)" },
        { value: "pnpm", label: "pnpm expo" },
        { value: "yarn", label: "yarn expo" },
        { value: "bunx", label: "bunx expo" },
      ],
      initialValue: detectExpoRunner(),
    })) as NativeConfig["expoRunner"] | symbol;
    if (typeof runner === "symbol") process.exit(0);
    config.expoRunner = runner as NativeConfig["expoRunner"];
  }

  config.baseDependencies = [...DEFAULT_BASE_DEPENDENCIES];

  // ── Write native-ui.json ─────────────────────────────────────
  writeConfig(config);

  // ── Summary ──────────────────────────────────────────────────
  note(
    [
      `${pc.dim("config")}            native-ui.json`,
      `${pc.dim("typescript")}        ${config.typescript ? "yes" : "no"}`,
      `${pc.dim("outputDir")}         ${config.outputDir}`,
      `${pc.dim("expoRunner")}        ${config.expoRunner}`,
      `${pc.dim("baseDependencies")}  ${config.baseDependencies.join(", ")}`,
      `${pc.dim("components")}        ${COMPONENTS.length} available`,
    ].join("\n"),
    "native-ui.json",
  );

  // ── Install base peer deps ───────────────────────────────────
  let shouldInstall: boolean | symbol = true;

  if (!opts.yes) {
    shouldInstall = await confirm({
      message: `Install base dependencies (${config.baseDependencies.join(", ")})?`,
      initialValue: true,
    });

    // FIX: Properly handle cancellation at the prompt
    if (typeof shouldInstall === "symbol") {
      log.info("Cancelled.");
      process.exit(0);
    }
  }

  if (shouldInstall) {
    // FIX: Filter base dependencies to skip already installed packages
    const missingBaseDeps = getMissingPackages(
      config.baseDependencies,
      projectRoot,
    );

    if (missingBaseDeps.length === 0) {
      log.success(pc.green("Base dependencies are already installed."));
    } else {
      const s = spinner();
      s.start(`Installing base dependencies…`);
      log.message(pc.dim(`Installing ${missingBaseDeps.join(", ")}…`));
      const ok = installPackages(
        missingBaseDeps,
        config.expoRunner,
        projectRoot,
      );
      if (ok) {
        s.stop(pc.green("Base dependencies installed."));
      } else {
        s.stop(pc.yellow("Install failed — run manually:"));
        log.message(
          pc.dim(`  ${buildInstallCmd(config.expoRunner, missingBaseDeps)}`),
        );
      }
    }
  }

  // ── Write shared lib helpers (theme / use-styles) ────────────
  try {
    const libEntries = await fetchRegistryEntries([
      "lib-theme",
      "lib-use-styles",
    ]);
    for (const entry of libEntries) {
      const file = entry.files?.[0];
      if (!file || typeof file.content !== "string") continue;
      const dest = path.resolve(
        projectRoot,
        file.target ?? file.path ?? entry.key,
      );
      writeFile(dest, file.content);
      markInstalled(entry.key.toLowerCase());
      log.message(pc.dim(`Wrote ${file.target ?? file.path ?? entry.key}`));
    }
  } catch {
    /* non-fatal */
  }

  outro(
    pc.cyan("Done! Run ") +
      pc.bold("nativeui-cli add") +
      pc.cyan(" to add components."),
  );
}
