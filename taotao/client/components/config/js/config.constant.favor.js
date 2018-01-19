/**
 * 定义可收藏属性
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'favorObj', {
            notFavor    : {
                value   : 0
            },
            favor       : {
                value   : 1
            }
        });
})();
