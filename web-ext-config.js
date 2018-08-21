module.exports = {
  // Global options:
  verbose: false,
  sourceDir: "extension",
  // Command options:
  build: {
    overwriteDest: true,
  },
  run: {
    startUrl: ["about:debugging"],
    pref: ["extensions.webextensions.tabhide.enabled=true"],
    noReload: true,
  },
};
