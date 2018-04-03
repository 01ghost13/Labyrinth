let mix = require('laravel-mix');

const WebpackShellPlugin = require('webpack-shell-plugin');




mix.webpackConfig({
    plugins:
    [
        new WebpackShellPlugin({onBuildStart: ['php artisan lang:js public/js/lang.js -c'], onBuildEnd: []})
    ]
}).version('public/js/lang.js');


mix.js('resources/assets/js/app.js', 'public/js')
   .ts('resources/assets/ts/game.ts', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css');




//if (mix.inProduction())
    mix.version();
