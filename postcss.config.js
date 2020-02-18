module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-preset-env': {
      features: {
        'custom-properties': {
          preserve: false,
        },
      },
    },
    cssnano: {},
  },
};
