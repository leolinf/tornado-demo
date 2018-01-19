/**
 * 定义可下载性属性
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'hasAttachmentObj', {
            all             : {
                value   : -1,
                name    : '全部'
            },
            downloadAble    : {
                value   : 1,
                name    : '可下载'
            },
            notDownloadAble : {
                value   : 0,
                name    : '无下载'
            }
        })
        .constant( 'hasAttachmentArr', [{
            value   : 1,
            name    : '可下载'
        },{
            value   : 0,
            name    : '无下载'
        }]);
})();
