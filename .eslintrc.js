module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-alttransfer`
  extends: ["alttransfer"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
