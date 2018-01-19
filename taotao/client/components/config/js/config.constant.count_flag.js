/**
 * 是否统计详情接口访问
 */
(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'countFlagObj', {
            notCount    : {
                value   : 0
            },
            count       : {
                value   : 1
            }
        });
})();
