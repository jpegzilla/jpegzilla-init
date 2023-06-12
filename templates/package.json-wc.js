module.exports = `{
  "name": "solace-eval",
  "version": "1.0.0",
  "description": "a vanilla javascript notes app.",
  "main": "index.js",
  "author": "eris <eris@jpegzilla.com>",
  "license": "MIT",
  "scripts": {
    "swm": "npx sass --watch --style=compressed ./css/main.sass:./css/main.min.css",
    "format": "prettier --write ."
  },
  "dependencies": {
    "eslint": "^7.32.0",
    "postcss-cli": "^9.1.0"
  },
  "devDependencies": {
    "eslint-config-standard": "^16.0.3",
    "eslint-plugin-import": "^2.24.2",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.3.1",
    "prettier": "^2.6.0"
  }
}`