const babel = require('rollup-plugin-babel');

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
            plugins: [
                babel({
                    exclude: 'node_modules/**',
                    presets: [
                        ['es2015', { modules: false }],
                    ],
                    plugins: [
                        'external-helpers',
                    ]
                })
            ],
            format: 'iife',
            sourceMap: 'inline',
        }
    });
};