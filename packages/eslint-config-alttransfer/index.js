/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "turbo",
    "prettier",
    "next",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  parser: "@typescript-eslint/parser",
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
