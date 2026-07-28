#!/usr/bin/env node
/**
 * Production CRA build with a hard heap limit.
 * Avoids shell/newline issues that drop --max-old-space-size.
 * GENERATE_SOURCEMAP=false cuts peak RAM a lot on large apps.
 */
const { spawnSync } = require("child_process");
const path = require("path");

const heapMb = process.env.BUILD_HEAP_MB || "12288";
process.env.NODE_OPTIONS = [
  process.env.NODE_OPTIONS,
  `--max-old-space-size=${heapMb}`,
]
  .filter(Boolean)
  .join(" ")
  .trim();

process.env.GENERATE_SOURCEMAP =
  process.env.GENERATE_SOURCEMAP === "true" ? "true" : "false";
// Skip eslint during build — large monorepo-style CRA apps OOM less without it
process.env.DISABLE_ESLINT_PLUGIN = process.env.DISABLE_ESLINT_PLUGIN || "true";

const reactScripts = path.join(
  __dirname,
  "..",
  "node_modules",
  "react-scripts",
  "bin",
  "react-scripts.js",
);

console.log(
  `[build-prod] NODE_OPTIONS=${process.env.NODE_OPTIONS} GENERATE_SOURCEMAP=${process.env.GENERATE_SOURCEMAP}`,
);

const result = spawnSync(
  process.execPath,
  [`--max-old-space-size=${heapMb}`, reactScripts, "build"],
  {
    stdio: "inherit",
    env: process.env,
    cwd: path.join(__dirname, ".."),
  },
);

process.exit(result.status === null ? 1 : result.status);
