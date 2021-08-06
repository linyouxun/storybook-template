const path = require('path');

var addLessLoader = (loaderOptions = {}) => (config, mode) => {
  // Need these for production mode, which are copied from react-scripts
  const publicPath = require('react-scripts/config/paths').servedPath;
  const shouldUseRelativeAssetPaths = publicPath === './';
  const isEnvDevelopment = mode === 'DEVELOPMENT';
  const isEnvProduction = mode === 'PRODUCTION';
  const lessRegex = /\.less$/;
  const lessModuleRegex = /\.module\.less$/;
  const sassOrLessTestRules = [
    '/\\.(scss|sass)$/',
    '/\\.module\\.(scss|sass)$/',
    '/\\.less$/',
    '/\\.module\\.less$/',
  ];

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: require('mini-css-extract-plugin').loader,
        options: shouldUseRelativeAssetPaths ? { publicPath: '../../' } : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            require('postcss-normalize')(),
          ],
          sourceMap: !isEnvProduction,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: !isEnvProduction,
            root: path.resolve(__dirname, '../src'),
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: { sourceMap: true },
        }
      );
    }
    return loaders;
  };

  const loaders = config.module.rules[2].oneOf;
  // Insert less-loader as the penultimate item of loaders (before file-loader)
  loaders.splice(
    loaders.length - 1,
    0,
    {
      test: lessRegex,
      exclude: lessModuleRegex,
      use: getStyleLoaders({ importLoaders: 3 }, 'less-loader'),
      sideEffects: true,
    },
    {
      test: lessModuleRegex,
      use: getStyleLoaders({ importLoaders: 3, modules: true }, 'less-loader'),
    }
  );
  loaders.forEach((loader) => {
    if (loader.test) {
      const testRule = loader.test.toString();
      if (sassOrLessTestRules.indexOf(testRule) > -1) {
        const loaderUse = loader.use;
        if (loaderUse[loaderUse.length - 1]) {
          loaderUse[loaderUse.length - 1].options['javascriptEnabled'] = true;
        }
      }
    }
  });

  return config;
};

module.exports = {
  stories: ['../src/components/**/*.stories.@(ts|js|tsx|jsx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    // '@storybook/addon-links',
    '@storybook/addon-notes',
    '@storybook/addon-storysource',
    // 'storybook-readme',
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    // Make whatever fine-grained changes you need

    addLessLoader()(config, configType);

    // Return the altered config
    return config;
  },
};
