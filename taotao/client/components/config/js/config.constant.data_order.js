/**
 * 定义数据排序方式
 * !!!注意要与需求排序定义变量保持一致
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'dataOrderObj', {
            all     : {
                value   : -1,
                name    : '默认'
            },
            hot     : {
                value   : 2,
                name    : '热度'
            },
            /*
            price   : {
                value   : 2,
                name    : '价格'
            },
            */
            time    : {
                value   : 1,
                name    : '时间'
            }
        })
        .constant( 'dataOrderArr', [{
            value   : -1,
            name    : '默认'
        },{
            value   : 2,
            name    : '热度'
        /*
        },{
            value   : 2,
            name    : '价格'
        */
        },{
            value   : 1,
            name    : '时间'
        }]);
})();
