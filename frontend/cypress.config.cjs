const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://study-flow-pro-kappa.vercel.app',
    defaultCommandTimeout: 10000,
    viewportWidth: 1366,
    viewportHeight: 768,
    setupNodeEvents() {},
  },
})
