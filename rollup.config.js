/* global require, module*/
const buble = require('rollup-plugin-buble');

module.exports = {
    entry: 'src/pocscrollbar.js',
    format: 'umd',
    moduleName: 'PocScrollbar',
    dest: 'dist/pocscrollbar.js',
    plugins: [
        buble(),
    ],
};
