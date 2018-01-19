/**
 * 定义需求截止日期
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'demandDeadlineObj', {
            longtime    : {
                value   : 1,
                name    : '长期有效'
            },
            deadTime    : {
                value   : 2,
                name    : '截止日期'
            }
        })
        .constant( 'demandDeadlineArr', [{
            value   : 1,
            name    : '长期有效'
        },{
            value   : 2,
            name    : '截止日期'
        }]);
})();
