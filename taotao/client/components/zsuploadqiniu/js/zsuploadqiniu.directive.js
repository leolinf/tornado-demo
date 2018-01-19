;(function(){
    'use strict';

    angular
        .module( 'ZS.uploadqiniu' )
        .directive( 'zsUploadQiniu', zsUploadQiniu );

    zsUploadQiniu.$inject = [];

    function zsUploadQiniu(){
        var directive = {
            restrict : 'EA',
            scope : {
                sourceLink : '=sourcelink',             // 上传成功后返回的链接
                attachmentName : '=attachmentname',     // 上传成功后返回的文件名
                attachmentSize : '=attachmentsize'      // 上传文件大小
            },
            templateUrl : '/components/zsuploadqiniu/index.tpl.html',
            link : link
        };

        return directive;

        function link( scope, element, attrs ){

            var randomId = Math.random()*( new Date().getTime() )*10000;
            var containerId = 'container' + randomId;

            scope.isUploading = false;

            scope.uploadQiniuConfig = {
                container : containerId,
                max_file_size : '500mb',
                max_retries : 3,
                drop_element : containerId,
            };

            scope.delFile = delFile;

            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',    //上传模式,依次退化
                browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
                get_new_uptoken: true,
                uptoken_url: '/v3/api/uptoken',
                    //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                // uptoken : '<Your upload token>',
                    //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                // unique_names: true,
                    // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
                // save_key: true,
                    // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
                unique_names: true,
                domain: 'http://7xr12e.com1.z0.glb.clouddn.com/',
                    //bucket 域名，下载资源时用到，**必需**
                container: scope.uploadQiniuConfig.container,           //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: scope.uploadQiniuConfig.max_file_size,           //最大文件体积限制
                flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
                max_retries: scope.uploadQiniuConfig.max_retries,                   //上传失败最大重试次数
                dragdrop: true,                   //开启可拖曳上传
                drop_element: scope.uploadQiniuConfig.container,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                //分块上传时，每片的体积
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function(up, file) {
                           // 每个文件上传前,处理相关的事情
                           scope.$apply( function(){
                               scope.isUploading = true;
                           });
                           //console.log( '开始上传' );
                    },
                    'UploadProgress': function(up, file) {
                           // 每个文件上传时,处理相关的事情
                           //scope.isUploading = true;
                    },
                    'FileUploaded': function(up, file, info) {
                           // 每个文件上传成功后,处理相关的事情
                           // 其中 info 是文件上传成功后，服务端返回的json，形式如
                           // {
                           //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                           //    "key": "gogopher.jpg"
                           //  }
                           // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                           // var domain = up.getOption('domain');
                           // var res = parseJSON(info);
                           // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
                           //console.log( info );
                           //console.log( file );
                           //console.log( up );
                           var domain = up.getOption('domain');
                           //var res = parseJSON(info);
                           var res = JSON.parse( info );
                           var sourceLink = domain + res.key; //获取上传成功后的文件的Url
                           scope.$apply( function(){
                               scope.attachmentName = file.name;
                               scope.sourceLink = sourceLink;
                               scope.attachmentSize = file.size;
                           });
                    },
                    'Error': function(up, err, errTip) {
                           //上传出错时,处理相关的事情
                           scope.$apply( function(){
                               scope.isUploading = false;
                           });
                           alert( "上传出错，请重新上传" );
                    },
                    'UploadComplete': function() {
                           scope.$apply( function(){
                               scope.isUploading = false;
                           });
                           //队列文件处理完毕后,处理相关的事情
                    },
                    'Key': function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效
                        var key = "";
                        // do something with key here
                        return key;
                    }
                }
            });

            function delFile(){
               scope.attachmentName = '';
               scope.sourceLink = '';
               scope.attachmentSize = 0;
            }
        }
    }
})();
