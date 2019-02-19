// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  env: {
    test: {
      presets: [
        [
          'env',
          {
            targets: {
              node: 'current'
            }
          }
        ]
      ]
    }
  }
};
