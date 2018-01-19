/**
 * @author wanglei@wolongdata.com
 * @copyright 2016 wolongdata.com LTD. All rights reserved
 */
'use strict';
//载入依赖
const gulp          = require( 'gulp' );
const fs            = require( 'fs' );
const path          = require( 'path' );
const merge         = require( 'merge-stream' );
const jshint        = require( 'gulp-jshint' );                 //js格式检查
const cache         = require( 'gulp-cached' );
const less          = require( 'gulp-less' );                   //less 编译
const replace       = require( 'gulp-replace' );
const flatten       = require( 'gulp-flatten' );                // 压平文件结构
const filter        = require( 'gulp-filter' );
//const rename        = require( 'gulp-rename' );
const uglify        = require( 'gulp-uglify' );                 //js压缩
const minifyCSS     = require( 'gulp-cssnano' );                //css压缩
const del           = require( 'del' );                         //清空数据
const minifyImage   = require ('gulp-imagemin');                //图片压缩
//const notify        = require('gulp-notify');                 //消息通知
const concat        = require('gulp-concat');
const autoprefixer  = require('gulp-autoprefixer');
const runSequence   = require( 'run-sequence' );
const svgSprite     = require("gulp-svg-sprite");               //整合svg
//const revCollector  = require('gulp-rev-collector');          // 路径替换
//const rev           = require('gulp-rev');                    // 为文件添加MD5后缀
const RevAll        = require( 'gulp-rev-all' );                // 文件hash和路径替换
const revdel        = require( 'gulp-rev-delete-original' );    // 清理打包生成的中间文件（位于原始文件之后，hash文件之前）
const minifyHTML    = require('gulp-htmlmin');
const glob          = require( 'glob' );
const sourcemaps    = require( 'gulp-sourcemaps' );
const debug         = require( 'gulp-debug' );

//文件路径配置
const publicDir = './public';
const buildDir = './build';

const filePath = {
    noNeedCompressFiles     : [                                                 // 不需要进行处理的文件列表，应该直接在client目录下，主要是处理spider相关文件
        'robots.txt'
    ],                                                   
    vendor      : {                                                             // 第三方文件与处理路径
        srcDir                  :  './vendor',
        buildDir                : buildDir + '/vendor',
        destDir                 : publicDir + '/vendor',
        noNeedCompressFolder    : [                                             // 不需要进行处理的文件夹列表,应该都在vendor目录下
            'jquery',
            'angular',
            'ui-bootstrap-angular',
            'highcharts',
            'ueditor'
        ]
    },
    fonts       : {                                                             // 字体文件与处理路径
        srcDir      : './fonts',
        destDir     : buildDir + '/assets/fonts'
    },
    iconFonts   : {                                                              // 字体图标文件与处理路径
        srcDir      : './icon_fonts',
        destDir     : buildDir + '/assets/icon_fonts'
    },
    iconSvgs    : {
        srcDir      : './icon_svgs', 
        destDir     : buildDir + '/assets/icon_svgs'
    },
    images      : {                                                             // 图片文件与处理路径
        srcDir      : './images',
        destDir     : buildDir + '/assets/images'
    },
    less        : {                                                             // less文件与处理路径
        srcDir      : './less',
        destDir     : buildDir + '/assets/css',
        noNeedBuildFolder    : [
            'base'
        ]
    },
    js          : {                                                             // js文件路径与处理路径
        modules     : {
            srcDir      : './modules',
            destDir     : buildDir + '/assets/js/modules'
        },
        components  : {
            srcDir      : './components',
            destDir     : buildDir + '/assets/js/components'
        }
    },
    views        : {                                                            // 视图文件路径与处理路径
        modules     : {
            srcDir      : './modules',
            destDir     : buildDir + '/modules'
        },
        components  : {
            srcDir      : './components',
            destDir     : buildDir + '/components'
        }
    }
};

/**
 * 获取指定目录或者目录数组下的所有子目录
 * @params [string] dir 指定的目录或者目录构成的数组
 */
function getFolders( dir ){
    if( dir instanceof Array ){
        var folders = [];
        dir.map( function( eachDir ){
            folders.concat( fs.readdirSync( eachDir )
            .filter( function( file ){
                return fs.statSync( path.join( dir, file ) ).isDirectory();
            }) );
        });
        return folders;
    }else{
        /*
        fs.statSync( dir, function( err, stats ){
            console.log( 'haha' );
            // errno 34表示notexist
            if( err && err.errno === 34 ){
                console.log( 'dir : ' + dir );
                return [];
            }else{
                return fs.readdirSync( dir )
                .filter( function( file ){
                    return fs.statSync( path.join( dir, file ) ).isDirectory();
                });
            }
        });
        */
        return fs.readdirSync( dir )
        .filter( function( file ){
            return fs.statSync( path.join( dir, file ) ).isDirectory();
        });
    }
}

/**
 * 针对只需要拷贝一次，不需要监视修改的文件进行处理，单独处理一次，
 * 之后不再监视，可以加快每次监视build时间，通常都是一些成熟的库文件
 */
gulp.task( 'copyToVendor', function( cb ){
    var vendorFolders = getFolders( filePath.vendor.srcDir );

    var needCopyFoldersInVendor = vendorFolders.filter( function( folder ){
        return ( filePath.vendor.noNeedCompressFolder.indexOf( folder ) !== -1 );
    });

    if( needCopyFoldersInVendor.length > 0 ){
        var tasks = needCopyFoldersInVendor.map( function( folder ){
            return gulp.src( path.join( filePath.vendor.srcDir, folder, '/**/*' ) )
            //.pipe( debug( { title : 'copyToVendor' } ) )
            .pipe( gulp.dest( path.join( publicDir + '/vendor', folder ) ) );
        });

        return merge( tasks );
    }else{
        cb();
    }
});

/**
 * vendor目录中需要监视修改的js文件处理任务归类为一组，这个任务需要被监视起来，
 * 这一组中的文件通常都是库文件的小插件一类的东西，需要不时增加
 */
gulp.task( 'buildJsToVendor', function( cb ){
    var vendorFolders = getFolders( filePath.vendor.srcDir );

    var needBuildFoldersInVendor = vendorFolders.filter( function( folder ){
        return ( filePath.vendor.noNeedCompressFolder.indexOf( folder ) === -1 );
    });

    var tasks = needBuildFoldersInVendor.map( function( folder ){
        return gulp.src( path.join( filePath.vendor.srcDir, folder, '/**/*.js' ) )
        //.pipe( jshint() )
        //.pipe( jshint.reporter( 'default', { verbose : 'true' } ) )
        //.pipe( debug( { title : 'buildJsToVendor' } ) )
        .pipe( concat( folder + '.js' ) )
        //.pipe( sourcemaps.init() )
        .pipe( uglify() )
        //.pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( filePath.vendor.destDir ) );
    });

    return merge( tasks );
});

/**
 * 非js库和引用第三方插件的js文件，需要build，并且每次监视到修改都需要重新build
 */
//gulp.task( 'buildJsToAssets', [ 'buildImages' ], function(){
gulp.task( 'buildJsToAssets', function(){
    var modulesJsFolders = getFolders( filePath.js.modules.srcDir );

    var modulesJsTasks = modulesJsFolders.map( function( folder ){
        return gulp.src([
            path.join( filePath.js.modules.srcDir, folder, '/js/' + folder + '.js' ), 
            path.join( filePath.js.modules.srcDir, folder, '/js/!(' + folder + ').js' ) 
        ], { base : './' })
        //.pipe( debug( { title : 'buildJsToAssets' } ) )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default', { verbose : 'true' } ) )
        .pipe( concat({ path : folder + '.js' }) )
        //.pipe( sourcemaps.init() )
        .pipe( uglify() )
        //.pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( filePath.js.modules.destDir ) );
    });

    var componentsJsFolders = getFolders( filePath.js.components.srcDir );

    var componentsJsTasks = componentsJsFolders.map( function( folder ){
        return gulp.src([
            path.join( filePath.js.components.srcDir, folder, '/js/' + folder + '.js' ),
            path.join( filePath.js.components.srcDir, folder, '/js/!(' + folder + ').js' ) 
        ], { base : './' })
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default', { verbose : 'true' } ) )
        .pipe( concat({ path : folder + '.js'}) )
        //.pipe( sourcemaps.init() )
        .pipe( uglify() )
        //.pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( filePath.js.components.destDir ) );
    });

    return merge( modulesJsTasks, componentsJsTasks );
});


/**
* css，less文件build
*/
//gulp.task( 'buildCssToAssets', [ 'copyFonts', 'buildSvgs', 'buildImages' ], function(){
gulp.task( 'buildCssToAssets', function(){
    
    var srcArray = [];

    filePath.less.noNeedBuildFolder.map( function( folder ){
        srcArray.push( filePath.less.srcDir + '/!(' + folder + ')/' );
        srcArray.push( filePath.less.srcDir + '/*.less' );
        srcArray.push( filePath.less.srcDir + '/*.css' );
    });
    return gulp.src( srcArray )
    //.pipe( revCollector() )
    //.pipe( filter( noNeedBuildFolderPatterns ) )
    .pipe( cache() )
    .pipe( less() )
    .pipe( autoprefixer() )
    .pipe( minifyCSS() )
    //.pipe( flatten() )
    //.pipe( rev() )
    .pipe( gulp.dest( filePath.less.destDir ) );
});


/**
* build svg文件
*/
gulp.task( 'buildSvgs', function(){
    // svg 文件过滤器
    const svgFilter = filter( '**/*.svg',{ restore : true } ); 
    // css 文件过滤器
    const cssFilter = filter( '**/*.css',{ restore : true } );
    
    return gulp.src( filePath.iconSvgs.srcDir + '/**/*' )
    .pipe( 
        svgSprite({
            dest    : filePath.iconSvgs.destDir,
            shape   : {
                /*
                id : {
                    separator : 'icon'
                }
                */
                /*
                dimension   : {
                    maxWidth    : 32,
                    maxHeight   : 32
                }
                */
            },
            mode    : {
                css : {
                    dest    : '.',
                    sprite  : 'sprite.svg',
                    bust : false,
                    render  : {
                        css     : true,
                        less    : true,
                    }
                },
                symbol : true
            }
        }).on( 'error', function( error ){
            console.log( 'process svg occur an error' );
            console.log( error );
        }) 
    )
    .pipe( svgFilter ) 
    .pipe( gulp.dest( filePath.iconSvgs.destDir ) )
    .pipe( svgFilter.restore )
    .pipe( cssFilter )
    .pipe( replace( /(sprite.*)/g, '/assets/icon_svgs/$1' ) )
    .pipe( less() )
    .pipe( autoprefixer() )
    .pipe( minifyCSS() )
    //.pipe( rev() )
    .pipe( gulp.dest( filePath.iconSvgs.destDir ) );
});

/**
* 拷贝字体文件，字体文件应该已经事前处理好了
*/
gulp.task( 'copyFonts', function( cb ){
    var fontsFolders = getFolders( filePath.fonts.srcDir );
     
    if( fontsFolders.length > 0 ){
        var tasks = fontsFolders.map( function( folder ){
            return gulp.src([ 
                path.join( filePath.fonts.srcDir, folder, '/!README.md' ),
                path.join( filePath.fonts.srcDir, folder, '/**/*' )
            ])
            .pipe( cache() )
            .pipe( gulp.dest( publicDir + '/' + folder ) );
        });

        return merge( tasks );
    }else{
        cb();
    }
});

/**
* build字体图标文件
*/
/*
gulp.task( 'copyIconFonts', function(){
    return gulp.src( path.join( filePath.iconFonts.srcDir, '/*' ) )
    .pipe( gulp.dest( filePath.iconFonts.destDir ) );
});
*/

/**
 * html文件处理 
 */
gulp.task( 'buildViews', function(){
    var modulesViewsFolders = getFolders( filePath.views.modules.srcDir );

    var modulesViewsTasks = modulesViewsFolders.map( function( folder ){
        return gulp.src([
            path.join( filePath.views.modules.srcDir, folder, '/views/*.html' ) 
        ])
        .pipe( minifyHTML() )
        .pipe( gulp.dest( path.join( filePath.views.modules.destDir, folder ) ) );
    });

    var componentsViewsFolders = getFolders( filePath.views.components.srcDir );

    var componentsViewsTasks = componentsViewsFolders.map( function( folder ){
        return gulp.src([
            path.join( filePath.views.components.srcDir, folder, '/views/*.html' ) 
        ])
        .pipe( minifyHTML() )
        .pipe( gulp.dest( path.join( filePath.views.components.destDir, folder ) ) );
    });

    return merge( modulesViewsTasks, componentsViewsTasks );
});

/**
 * 文件中静态资源引用路径替换
 */
//gulp.task( 'replace', [ 'copyToVendor', 'buildJsToVendor', 'buildJsToAssets' ], function(){
gulp.task( 'replace', function(){
    var dontGlobalArray = [
        /^\/assets\/[^/]*\/.*\.map$/g,
        /^\/assets\/[^/]*\/.*\.md$/g,
        /^\/vendor\/[^/]*\/.*\.map$/g,
        /^\/vendor\/.*\.map$/g,
        /^\/vendor\/[^/]*\/.*\.md$/g,
    ];
    var dontRenameFileArray = [
        /^\/modules\/core\/frame\.tpl\.html$/g,
        /^\/serverpage\/data_demand.html/g,
        /^\/serverpage\/data_demand_detail.html/g,
        /^\/serverpage\/data_search.html/g,
        /^\/serverpage\/data_search_detail.html/g,
        /^\/serverpage\/index.html/g,
        /^\/serverpage\/quality_data.html/g,
    ];
    filePath.vendor.noNeedCompressFolder.map( function( folder ){
        var reg = new RegExp( '^/vendor/' +folder+ '/*', 'g' );
        dontRenameFileArray.push( reg );
    });
    console.log( dontRenameFileArray );
    var revAll = new RevAll({
        dontGlobal : dontGlobalArray,
        dontRenameFile : dontRenameFileArray
    });

    return gulp.src( buildDir + '/**/*' )
    //.pipe( debug( { title : 'replace' } ) )
    .pipe( revAll.revision() )
    //.pipe( revdel() )
    .pipe( gulp.dest( publicDir ) )
    .pipe( revAll.manifestFile() )
    .pipe( gulp.dest( '.' ) );
});

/**
 * clean部分经常变动的打包文件，每次重新运行前需要进行
 */
gulp.task( 'clean', function(){
    return del([
        publicDir + '/vendor{,/**/*}',
        publicDir + '/assets/**/*',
        '!' + publicDir + '/assets/images{,/**/*}',
        //publicDir + '/assets/fonts/',
        //publicDir + '/assets/icon_fonts/',
        publicDir + '/modules{,/**/*}',
        publicDir + '/components{,/**/*}',
        //buildDir + '/**/*',
        //buildDir + '/vendor{,/**/*}',
        //buildDir + '/assets/**/*',
        //'!' + buildDir + '/assets/images{,/**/*}',
        './rev-manifest.json'
    ])
    .then( function(){
        console.log( 'assets/css, assets/js, icon_fonts, fonts were cleaned' );
    });
});

/**
 * clean 全部打包文件，当偶尔引用第三方发生变动的时候需要执行
 */
gulp.task( 'cleanall', function(){
    return del([
        publicDir + '{,/**/*}',
        buildDir + '{,/**/*}',
        './rev-manifest.json',
        './images-rev-manifest.json'
    ])
    .then( function(){
        console.log( 'all cleaned' );
    });
});

/**
* build图片文件
*/
gulp.task( 'buildImages', function(){
    return  gulp.src( filePath.images.srcDir + '/**/*' )
    .pipe( minifyImage({
        progressive : true,                 // for jpg images
        optimizationLevel : 3,              // for png images
        interlaced : true                   // for gif images
    }) )
    //.pipe( rev() )
    .pipe( cache() )
    .pipe( gulp.dest( filePath.images.destDir ) );
});

/**
 * 图片文件hash处理并生成到public目录下
 */
gulp.task( 'hashImages', function(){
    var revAll = new RevAll({
        fileNameManifest : 'images-manifest.json'
    });
    return gulp.src( buildDir + '/assets/images/**/*' )
    .pipe( revAll.revision() )
    .pipe( gulp.dest( publicDir + '/assets/images' ) )
    .pipe( revAll.manifestFile() )
    .pipe( gulp.dest( '.' ) );
});

gulp.task( 'images', function( cb ){
    runSequence( 'buildImages', 'hashImages', cb );
});

/**
* 监控任务
*/
gulp.task( 'watch', function(){
    // 监控html文件变更
    //var viewsWatcher = gulp.watch([
    gulp.watch([
        path.join( filePath.views.modules.srcDir , '/**/views/*.html' ),
        path.join( filePath.views.components.srcDir , '/**/views/*.html' )
    ], [ 'buildViews' ] );

    gulp.watch([
        './serverpage/**/*' 
    ], [ 'copyServerPage' ]);

    // 监控less文件变更
    //var lessWatcher = gulp.watch([
    gulp.watch([
        path.join( filePath.less.srcDir, '/**/*.less' ),
        path.join( filePath.less.srcDir, '/**/*.css' )
    ], [ 'buildCssToAssets' ] );

    // 监控images文件变更
    //var imagesWatcher = gulp.watch([
    gulp.watch([
        path.join( filePath.images.srcDir, '/**/*.jpg' ),
        path.join( filePath.images.srcDir, '/**/*.png' ),
        path.join( filePath.images.srcDir, '/**/*.gif' ),
        path.join( filePath.images.srcDir, '/**/*.ico' )
    ], [ 'buildImages' ] );

    // 监控js文件变更
    //var jsWatcher = gulp.watch([
    gulp.watch([
        path.join( filePath.js.modules.srcDir, '/**/js/*.js' ),
        path.join( filePath.js.components.srcDir, '/**/js/*.js' )
    ], [ 'buildJsToAssets' ] );

    // 监控svg文件变更 
    //var svgsWatcher = gulp.watch([
    gulp.watch([
        path.join( filePath.iconSvgs.srcDir, '/**/*.svg' )
    ], [ 'buildSvgs' ] );

    // 监控vendor目录下文件变更 
    //var vendorWatcher = gulp.watch([
    gulp.watch([
        path.join( filePath.vendor.srcDir, '/**/*' )
    ], [ 'buildJsToVendor', 'copyToVendor' ] );

    gulp.watch([
        'json_data/**/*'
    ], [ 'copyData' ] );

    //var revmanifestWatcher = gulp.watch([
    gulp.watch([
        buildDir + '/**/*'
    ], [ 'replace' ] );
});

/**
 * 仅仅前端开发用
 */
gulp.task( 'copyData', function(){
    return gulp.src( 'json_data/**/*' )
    .pipe( gulp.dest( publicDir + '/json_data' ) );
});

/**
 * 用于seo
 */
gulp.task( 'copyServerPage', function(){
    return gulp.src( './serverpage/**/*' )
    .pipe( gulp.dest( './build/serverpage/' ) );
});

/**
 * 拷贝robots协议规则文件和各个搜索引擎验证文件
 */
gulp.task( 'copyRobotsAndVerify', function(){
    return gulp.src([ 
        './robots.txt',
        './baidu_verify_*.html',
        './sogousiteverification.txt'
    ])
    .pipe( gulp.dest( './public' ) );
});

/*
gulp.task( 'default', [ 'copyFonts', 'copyToVendor', 'buildSvgs', 'buildImages', 'buildCssToAssets', 'buildJsToVendor', 'buildJsToAssets', 'replace' ], function(){
});
*/
gulp.task( 'default', function( cb ){
    runSequence( 'clean', [ 'copyFonts', 'copyToVendor', 'copyServerPage', 'buildSvgs' , 'buildCssToAssets', 'buildJsToVendor', 'buildJsToAssets', 'buildViews', 'copyData' ], 'replace', 'copyRobotsAndVerify', 'watch', cb ); 
    //runSequence( 'clean', [ 'copyToVendor', 'buildJsToVendor', 'buildJsToAssets', 'buildViews' ], 'replace', 'watch', cb ); 
});
