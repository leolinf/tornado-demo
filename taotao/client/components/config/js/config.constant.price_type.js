/**
 * 定义数据标价方式，需要关心demandPriceType定义情况
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'priceTypeObj', {
            all     : {
                value   : -1,
                name    : '全部'
            },
            charge  : {
                value   : 0,
                name    : '收费'
            },
            free    : {
                value   : 1,
                name    : '免费'
            },
            discuss : {
                value   : 2,
                name    : '面议'
            }
        })
        .constant( 'priceTypeArr', [{
            value   : 0,
            name    : '收费'
        },{
            value   : 1,
            name    : '免费'
        },{
            value   : 2,
            name    : '面议'
        }]);

})();
