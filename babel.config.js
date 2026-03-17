module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // reanimated: false prevents babel-preset-expo from auto-including
      // react-native-worklets/plugin (nativewind/babel already includes it)
      ['babel-preset-expo', { jsxImportSource: 'nativewind', reanimated: false }],
      // nativewind/babel is a preset (exports object with plugins array), not a function plugin
      'nativewind/babel',
    ],
  };
};
