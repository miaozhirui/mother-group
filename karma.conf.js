// Karma configuration
// Generated on Wed Jun 01 2016 10:57:02 GMT+0800 (CST)
var path = require('path');

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            "./src/js/libs/angular.js",
            "./src/js/libs/angular_mock.js",
            "./src/main.js",
            "./src/pages/**/*.js",
            "./unit/**/*.js"
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            require('karma-webpack')
        ],
        webpack: {
            entry: './src/main.js',
            
            module: {
                loaders: [{
                    test: path.join(__dirname, 'src'),
                    loader: 'babel',
                    exclude: /node_modules/
                },{
                    test: /\.(png|jpg)$/,
                    loader: 'url?limit=40000'
                }, {
                    test: /\.html$/,
                    loader: 'html-loader'
                }],
               
            }
        }
    })
}
