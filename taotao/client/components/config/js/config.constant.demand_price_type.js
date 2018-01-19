/**
 * 定义需求标价方式，需要关心priceType类型定义情况
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'demandPriceTypeObj', {
            charge  : {
                value   : 0,
                name    : '价格',
            },
            discuss : {
                value   : 2,
                name    : '面议',
            }
        })
        .constant( 'demandPriceTypeReverseObj', {
            0       : {
                name    : '价格'
            },
            2       : {
                name    : '面议'
            }
        })
        .constant( 'demandPriceTypeArr', [{
            value   : 0,
            name    : '价格',
        },{
            value   : 2,
            name    : '面议',
        }]);

})();
