/**
 * 定义用户类型
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'customerTypeObj', {
            personal    : {
                value   : 0,
                name    : '个人'
            },
            company     : {
                value   : 1,
                name    : '公司'
            }
        })
        .constant( 'customerTypeArr', [{
            value   : 0,
            name    : '个人'
        },{
            value   : 1,
            name    : '公司'
        }]);
})();
