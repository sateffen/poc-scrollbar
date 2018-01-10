/* global require, module*/
const buble = require('rollup-plugin-buble');
const pkg = require('./package.json');

module.exports = {
    input: 'src/pocscrollbar.js',
    output: {
        format: 'umd',
        banner: `/* Name: ${pkg.name}, Version: ${pkg.version}, License: ${pkg.license}*/`,
        name: 'PocScrollbar',
        file: 'dist/pocscrollbar.js',
    },
    plugins: [
        buble(),
    ],
};
