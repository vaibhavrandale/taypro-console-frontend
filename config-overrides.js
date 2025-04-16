// config-overrides.js
module.exports = function override(config, env) {
  // Find source-map-loader rule
  const sourceMapLoaderRule = config.module.rules
    .find((rule) => rule.oneOf)
    ?.oneOf?.find(
      (r) =>
        r.enforce === "pre" &&
        r.use &&
        r.use.some((u) => u.loader && u.loader.includes("source-map-loader"))
    );

  if (sourceMapLoaderRule) {
    sourceMapLoaderRule.exclude = [
      ...(sourceMapLoaderRule.exclude || []),
      /html2pdf\.js/,
    ];
  }

  return config;
};
