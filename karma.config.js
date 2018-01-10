/* globals require, module*/
const buble = require('rollup-plugin-buble');

module.exports = (config) => {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        reporters: ['progress'],
        files: [
            'test/**/*.spec.js',
        ],
        preprocessors: {
            'test/**/*.spec.js': ['rollup'],
        },
        rollupPreprocessor: {
            output: {
                name: 'pocScrollbar',
                format: 'iife',
                sourcemap: 'inline',
            },
            plugins: [
                buble(),
            ],
        },
    });
};
