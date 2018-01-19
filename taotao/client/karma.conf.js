// Karma configuration
// Generated on Tue Mar 22 2016 15:13:47 GMT+0800 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        // 库相关文件
        'vendor/angular/angular.min.js',
        'vendor/jquery/jquery.min.js',
        'vendor/jquery-plugin/**/*.js',
        'vendor/underscore/underscore.js',
        'vendor/angular-plugin/**/*.js',
        'vendor/ui-bootstrap-angular/ui-bootstrap-tpls.min.js',
        'vendor/!ueditor{,/**/*}',

        'node_modules/angular-mocks/angular-mocks.js',

        'modules/bootstrap/js/bootstrap.js',
        'modules/bootstrap/js/*.js',
        'modules/core/js/core.js',
        'modules/core/js/*.js',
        'modules/account/js/account.js',
        'modules/account/js/*.js',
        'modules/data/js/data.js',
        'modules/data/js/*.js',
        'modules/demand/js/demand.js',
        'modules/demand/js/*.js',
        'modules/user_center/js/user_center.js',
        'modules/user_center/js/*.js',
        'components/config/js/config.js',
        'components/config/js/*.js',
        'components/validator/js/validator.js',
        'components/validator/js/*.js',
        'components/detail/js/detail.js',
        'components/detail/js/*.js',
        'components/signin/js/signin.js',
        'components/signin/js/*.js',

        'components/zstag/js/zstag.js',
        'components/zstag/js/*.js',
        'components/zscatstring/js/zscatstring.js',
        'components/zscatstring/js/*.js',
        'components/zsselect/js/zsselect.js',
        'components/zsselect/js/*.js',

        'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
        'modules/**/test/**/*.js',
        'modules/**/test/**/*.spec.js',
        'components/**/test/**/*.js',
        'components/**/test/**/*.spec.js',

        // fixtures
        { 
            pattern     : 'json_data/{*,**/*}.mock.json',
            watched     : true,
            served      : true,
            included    : false
        },
    ],


    // list of files to exclude
    exclude: [
      '**/*.swp'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


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
    browsers: ['PhantomJS'],
    //browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
