module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('postcss-smart-import')({ /* ...options */ }),
                  require('precss')({ /* ...options */ }),
                  require('autoprefixer')({ /* ...options */ })
                ];
              }
            }
          }
        ]
      }
    ]
  }
}
