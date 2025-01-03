module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "react-native-reanimated/plugin",
      ["module-resolver",
        {
          root: ["./src"],
          alias: {
            "@/assets": "./src/assets",
            "@/hooks": "./src/hooks",
            "@/imgs": "./src/assets/imgs",
            "@/context": "./src/context",
            "@/screens": "./src/screens",
            "@/ui": "./src/ui",
            "@/api": "./src/api"
          }
        }]
    ]
  };
};
