import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
  },
  plugins: ["import", "eslint", "typescript", "unicorn", "oxc"],
  jsPlugins: [
    {
      name: "boundaries",
      specifier: "eslint-plugin-boundaries",
    },
  ],
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
});
