/**
 * 定义数据格式
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'dataFormatObj', {
            all     : {
                value   : -1,
                name    : '全部'
            },
            text    : {
                value   : 0,
                name    : '文本' 
            },
            audio   : {
                value   : 1,
                name    : '语音'
            },
            video   : {
                value   : 2,
                name    : '视频'
            },
            graphic : {
                value   : 3,
                name    : '图像'
            },
            api     : {
                value   : 4,
                name    : 'API'
            }
        })
        .constant( 'dataFormatArr', [{
            value   : 0,
            name    : '文本' 
        },{
            value   : 1,
            name    : '语音'
        },{
            value   : 2,
            name    : '视频'
        },{
            value   : 3,
            name    : '图像'
        },{
            value   : 4,
            name    : 'API'
        }])
        .constant( 'dataFormatReverseObj', {
            0 : {
                name    : '文本' 
            },
            1 : {
                name    : '语音'
            },
            2 : {
                name    : '视频'
            },
            3 : {
                name    : '图像'
            },
            4 : {
                name    : 'API'
            },
        });

})();
