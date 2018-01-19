/**
 * 定义数据来源
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'dataComefromObj', {
            all     : {
                value   : -1,
                name    : '全部'
            },
            exclusive   : {
                value   : 0,
                name    : '独家数据' 
            },
            thirdParty  : {
                value   : 1,
                name    : '第三方数据'
            },
            released    : {
                value   : 2,
                name    : '平台发布数据'
            }
        })
        .constant( 'dataComefromArr', [{
            value   : 0,
            name    : '独家数据' 
        },{
            value   : 1,
            name    : '第三方数据'
        },{
            value   : 2,
            name    : '平台发布数据'
        }]);

})();
