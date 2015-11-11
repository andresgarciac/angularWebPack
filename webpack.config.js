var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './app/modules/app.js',
  output: {
    path: 'assets',
    filename: 'app.min.js'
  },
  resolve: {
    root: [
      // We want roots to resolve the app code:
      path.resolve('app', 'modules'),
      // and the bower components:
      path.resolve('app', 'bower_components')],
    alias: {
      'bower': path.resolve( __dirname, 'app/bower_components'),
      //'ui.router$': 'angular-ui-router/release/angular-ui-router',
      'ui.grid$': 'angular-ui-grid/ui-grid',
      'ngTouch$': 'angular-touch/angular-touch'
    }
  },


  module: {


    loaders: [    
    { test: /\.css$/, loader: "style-loader!css-loader" },
    { test: /\.png$/, loader: "url-loader?limit=100000&mimetype=image/png" },
    { test: /\.jpg$/, loader: "file-loader" },
    //{ test: /\.less$/, loader: 'less' },
      //{ test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
    { test: /\.woff$/, loader: "url-loader?limit=5000&mimetype=application/font-woff" },
    { test: /\.woff2$/, loader: "url-loader?limit=5000&mimetype=application/font-woff" },
    { test: /\.ttf$/, loader: "url-loader?prefix=font" },
    { test: /\.eot$/, loader: "url-loader?prefix=font" },
    { test: /\.svg$/, loader: "url-loader?prefix=font" }]
  },

  plugins: [
    new webpack.ProvidePlugin({
      'angular': 'exports?window.angular!bower/angular'
    }),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    )/*,
     new webpack.optimize.UglifyJsPlugin({
    compress: {
         sequences: false,
           properties: false,
           dead_code: false,
           drop_debugger: false,
           unsafe: false,
           conditionals: false,
           comparisons: false,
           evaluate: false,
           booleans: false,
           loops: false,
           unused: false,
           hoist_funs: false,
           hoist_vars: false,
           if_return: false,
           join_vars: false,
           cascade: false,
           side_effects: false,
           warnings: false,
           global_defs: {} 
    }
})*/
  ]
};
