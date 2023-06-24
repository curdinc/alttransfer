module.exports = {
  root: true,
  extends: ["alttransfer", "plugin:@tanstack/eslint-plugin-query/recommended"],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
