/**
 * 定义可下载性属性
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'verifyCodeTypeObj', {
            signup          : {
                value   : 0
            },
            resetPassword   : {
                value   : 1
            }
        });
})();
