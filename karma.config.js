const babel = require('rollup-plugin-babel');

module.exports = (config) => {
    config.set({
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        reporters: ['progress'],
        files: [
            'test/**/*.test.js',
        ],
        preprocessors: {
            'test/**/*.test.js': ['rollup'],
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