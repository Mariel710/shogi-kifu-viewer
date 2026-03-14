const expoConfig = require('eslint-config-expo/flat');
const securityPlugin = require('eslint-plugin-security');

module.exports = [
  ...expoConfig,
  securityPlugin.configs.recommended,
  {
    rules: {
      // detect-object-injection has many false positives with typed array indexing
      'security/detect-object-injection': 'warn',
    },
  },
];
