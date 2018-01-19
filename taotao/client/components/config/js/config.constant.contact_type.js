/**
 * 定义用户联系方式类型
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'contactTypeObj', {
            mobilePhone : {
                value   : 0,
                name    : '手机'
            },
            phone       : {
                value   : 1,
                name    : '座机'
            },
            qq          : {
                value   : 2,
                name    : 'QQ'
            },
            email       : {
                value   : 3,
                name    : '邮箱'
            },
        })
        .constant( 'contactTypeArr', [{
            value   : 0,
            name    : '手机'
        },{
            value   : 1,
            name    : '座机'
        },{
            value   : 2,
            name    : 'QQ'
        },{
            value   : 3,
            name    : '邮箱'
        }]);
})();
