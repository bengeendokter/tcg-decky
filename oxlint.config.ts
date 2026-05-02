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
      { type: "feature", pattern: "src/libs/*/feature/*" },
      { type: "data-access", pattern: "src/libs/*/data-access/*" },
      { type: "ui", pattern: "src/libs/*/ui/*" },
      { type: "util", pattern: "src/libs/*/util/*" },
      { type: "model", pattern: "src/libs/*/model/*" },
    ],
  },
  rules: {
    "boundaries/dependencies": [
      2,
      {
        default: "allow",
        rules: [
          // {
          //   from: { type: "feature" },
          //   allow: { to: { type: ["data-access", "ui", "util", "model"] } },
          // },
          // {
          //   from: { type: "data-access" },
          //   allow: { to: { type: ["util", "model"] } },
          // },
          // {
          //   from: { type: "ui" },
          //   allow: { to: { type: ["util", "model"] } },
          // },
          // {
          //   from: { type: "util" },
          //   allow: { to: { type: ["model"] } },
          // },
        ],
      },
    ],
  },
});
