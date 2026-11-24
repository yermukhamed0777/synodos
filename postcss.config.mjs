// Explicitly no PostCSS plugins: this project uses plain CSS only.
// This also prevents inheriting any PostCSS config from a parent directory
// in hosted environments where the app shares a workspace.
export default {
  plugins: {},
};
