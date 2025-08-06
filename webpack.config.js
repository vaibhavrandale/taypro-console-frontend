// webpack.config.js
module.exports = {
  // ... other configurations
  stats: {
    warningsFilter: [/Failed to parse source map/],
  },
  // or for specific modules:
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules\/html2pdf\.js/, // Exclude html2pdf.js from source-map-loader
      },
      // ... other rules
    ],
  },
};
