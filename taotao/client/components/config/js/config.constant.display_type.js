/**
 * 定义详细内容部分显示类型
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'displayTypeObj', {
            baiduApi : {
                value   : 3,
                name    : '百度api'
            },
            datatang:{
                value   : 0,
                name    : '数据堂'
            },
            dataTangApi : {
                value   : 1,
                name    : '数据堂api'
            },

            jdwx        : {
                value   : 2,
                name    : 'jdwx'
            },
            weibo       : {
                value   : 4,
                name    : '微博'
            },
            juhe        : {
                value   : 5,
                name    : 'juhe'
            },
            dataMore    : {
                value   : 6,
                name    : 'dataMore'
            },
            gxyy        : {
                value   : 7,
                name    : 'gxyy'
            },
            noApi       : {
                value   : -1,
                name    :'没有数据'
            }
        })
        .constant( 'displayTypeReverseObj', {
            3:{
                name    :'百度api',
                value   :'baiduApi'
            },
            0:{
                name    :'数据堂',
                value   :'datatang' 
            },
            1:{
                name:'数据堂api',
                value:'dataTangApi'
            },
            2:{
                name:'jdwx',
                value:'jdwx'
            },
            4:{
                name:'微博',
                value:'weibo'
            },
            5:{
                name:'juhe',
                value:'juhe'
            },
            6:{
                name:'dataMore',
                value:'dataMore'
            },
            7:{
                name:'gxyy',
                value:'gxyy'
            },
            '-1':{
                name:'没有数据',
                value:'noApi'
            }
        });
})();
