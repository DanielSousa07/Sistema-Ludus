module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // O PLUGIN DO REANIMATED DEVE ESTAR AQUI E SER O ÚLTIMO
    plugins: [
      // Outros plugins, se houver...
      'react-native-reanimated/plugin', // <--- ESSENCIAL!
    ],
  };
}