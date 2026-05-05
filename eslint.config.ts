import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import typescriptParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { "@typescript-eslint": typescriptEslintPlugin as any, js, boundaries },
    settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
      "boundaries/elements": [
        { type: "feature", pattern: "feature/*", mode: "file" },
        { type: "data-access", pattern: "data-access/*", mode: "file" },
        { type: "ui", pattern: "ui/*", mode: "file" },
        { type: "util", pattern: "util/*", mode: "file" },
        { type: "model", pattern: "model/*", mode: "file" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        2,
        {
          default: "disallow",
          rules: [
            {
              from: { type: "feature" },
              allow: { to: { type: ["feature", "data-access", "ui", "util", "model"] } },
            },
            {
              from: { type: "data-access" },
              allow: { to: { type: ["data-access", "util", "model"] } },
            },
            {
              from: { type: "ui" },
              allow: { to: { type: ["ui", "util", "model"] } },
            },
            {
              from: { type: "util" },
              allow: { to: { type: ["util", "model"] } },
            },
            {
              from: { type: "model" },
              allow: { to: { type: ["model"] } },
            },
          ],
        },
      ],
    },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node }, parser: typescriptParser },
  },
  tseslint.configs.recommended,
]);
