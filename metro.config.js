const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')

const root = path.resolve(__dirname, '..')

const defaultConfig = getDefaultConfig(__dirname)
const { assetExts, sourceExts } = defaultConfig.resolver

const config = {
  watchFolders: [root],

  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },

  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],

    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],

    extraNodeModules: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      'react-native-svg': path.resolve(__dirname, 'node_modules/react-native-svg')
    },
  },
};

module.exports = mergeConfig(defaultConfig, config)
