/**
 * 定义需求排序方式
 * !!!注意要与数据排序定义变量值保持一致
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'demandOrderObj', {
            all     : {
                value   : -1,
                name    : '全部'
            },
            price   : {
                value   : 2,
                name    : '价格'
            },
            time    : {
                value   : 3,
                name    : '最新'
            }
        })
        .constant( 'demandOrderArr', [{
            value   : 2,
            name    : '价格'
        },{
            value   : 3,
            name    : '最新'
        }]);
})();
