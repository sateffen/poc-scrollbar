/* global require, module*/
const buble = require('rollup-plugin-buble');
const pkg = require('./package.json');

module.exports = {
    entry: 'src/pocscrollbar.js',
    format: 'umd',
    banner: `/* Name: ${pkg.name}, Version: ${pkg.version}, License: ${pkg.license}*/`,
    moduleName: 'PocScrollbar',
    dest: 'dist/pocscrollbar.js',
    plugins: [
        buble()
    ]
};
