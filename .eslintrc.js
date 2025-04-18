module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:prettier/recommended",
    // 'plugin:react-hooks/recommended',
    // 'plugin:storybook/recommended',
    "plugin:tailwindcss/recommended",
  ],
  ignorePatterns: [
    ".eslintrc.js",
    "config-overrides.js",
    "lint-staged.js",
    "postcss.config.js",
    "tailwind.config.js",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: ["tsconfig.json", "tsconfig.lib.json", "cypress/tsconfig.json"],
  },
  plugins: [
    "@typescript-eslint",
    // "prettier",
    // "react-hooks",
    // "storybook",
    "tailwindcss",
  ],
  root: true,
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    // "@typescript-eslint/consistent-type-imports": "warn",
    "tailwindcss/classnames-order": [
      "warn",
      {
        officialSorting: true,
      },
    ],
  },
};
