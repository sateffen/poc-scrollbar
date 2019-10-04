/* globals require, module*/
const rollupConfig = require('./rollup.config');

module.exports = (config) => {
    config.set({
        browsers: ['ChromeHeadless'],
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
            plugins: rollupConfig.plugins,
        },
    });
};
