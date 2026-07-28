#!/usr/bin/env node
"use strict";

/**
 * CRA production build with an explicit Node heap limit.
 * Use this instead of nesting flags in npm scripts (those often get dropped on deploy).
 *
 * Env (optional):
 *   BUILD_HEAP_MB=12288
 *   GENERATE_SOURCEMAP=true|false   (default false — saves a lot of RAM)
 *   DISABLE_ESLINT_PLUGIN=true|false (default true)
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reactScripts = path.join(
  root,
  "node_modules",
  "react-scripts",
  "bin",
  "react-scripts.js",
);

if (!fs.existsSync(reactScripts)) {
  console.error(
    "[build-prod] react-scripts not found. Run: npm install",
  );
  process.exit(1);
}

const heapMb = String(process.env.BUILD_HEAP_MB || "12288").replace(/\D/g, "") || "12288";
const generateSourceMap =
  String(process.env.GENERATE_SOURCEMAP || "false").toLowerCase() === "true"
    ? "true"
    : "false";
const disableEslint =
  String(process.env.DISABLE_ESLINT_PLUGIN || "true").toLowerCase() === "false"
    ? "false"
    : "true";

const env = {
  ...process.env,
  GENERATE_SOURCEMAP: generateSourceMap,
  DISABLE_ESLINT_PLUGIN: disableEslint,
  NODE_OPTIONS: [process.env.NODE_OPTIONS, `--max-old-space-size=${heapMb}`]
    .filter(Boolean)
    .join(" ")
    .trim(),
};

console.log("[build-prod] starting CRA production build");
console.log(`[build-prod] heap=${heapMb}MB sourcemap=${generateSourceMap} eslintPluginDisabled=${disableEslint}`);

const result = spawnSync(
  process.execPath,
  [`--max-old-space-size=${heapMb}`, reactScripts, "build"],
  {
    cwd: root,
    env,
    stdio: "inherit",
  },
);

if (result.error) {
  console.error("[build-prod] failed to start:", result.error.message);
  process.exit(1);
}

if (result.signal) {
  console.error(`[build-prod] killed by signal: ${result.signal}`);
  process.exit(1);
}

process.exit(typeof result.status === "number" ? result.status : 1);
