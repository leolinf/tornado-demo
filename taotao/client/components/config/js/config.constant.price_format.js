/**
 * 定义标价方式
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'priceFormatArr', [{
            value   : 1,
            name    : '元'
        },{
            value   : 0,
            name    : '元/条'
        },{
            value   : 2,
            name    : '元起'
        }])
        .constant( 'priceFormatObj', {
            all             : {
                value   : -1,
                name    : '全部'
            },
            yuan            : {
                value   : 1,
                name    : '元'
            },
            eachItemFare    : {
                value   : 0,
                name    : '元/条'
            },
            startFare       : {
                value   : 2,
                name    : '元起'
            }
        })
        .constant( 'priceFormatReverseObj', {
            "-1"  : {
                name    : '全部'
            },
            0   : {
                name    : '元/条'
            },
            1   : {
                name    : '元'
            },
            2   : {
                name    : '元起'
            }
        });

})();
