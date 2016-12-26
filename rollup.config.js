/* global require, module*/
const babel = require('rollup-plugin-babel');

module.exports = {
    entry: 'src/scrollcontainer.js',
    format: 'umd',
    moduleName: 'pocScrollbar',
    dest: 'dist/pocscrollbar.js',
    plugins: [
        babel({
            presets: [
                [
                    'es2015',
                    { modules: false },
                ],
            ],
            plugins: [
                'external-helpers',
            ]
        })
    ]
};