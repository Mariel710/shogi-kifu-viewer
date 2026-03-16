module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // reanimated: false prevents babel-preset-expo from auto-including
      // react-native-worklets/plugin (nativewind/babel already includes it)
      ['babel-preset-expo', { jsxImportSource: 'nativewind', reanimated: false }],
    ],
    plugins: [
      // nativewind/babel must be listed as a plugin (not a preset) in NativeWind v4
      'nativewind/babel',
    ],
  };
};
