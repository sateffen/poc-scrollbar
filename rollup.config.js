/* global require, module*/
const buble = require('rollup-plugin-buble');

module.exports = {
    entry: 'src/scrollcontainer.js',
    format: 'umd',
    moduleName: 'pocScrollbar',
    dest: 'dist/pocscrollbar.js',
    plugins: [
        buble(),
    ]
};