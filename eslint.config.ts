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
        typescript: {
          alwaysTryTypes: true,
        },
      },
      "boundaries/elements": [
        { type: "feature", pattern: "feature/*" },
        { type: "data-access", pattern: "data-access/*" },
        { type: "ui", pattern: "ui/*" },
        { type: "util", pattern: "util/*" },
        { type: "model", pattern: "model/*" },
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
              allow: { to: { type: ["data-access", "ui", "util", "model"] } },
            },
            {
              from: { type: "data-access" },
              allow: { to: { type: ["util", "model"] } },
            },
            {
              from: { type: "ui" },
              allow: { to: { type: ["util", "model"] } },
            },
            {
              from: { type: "util" },
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
