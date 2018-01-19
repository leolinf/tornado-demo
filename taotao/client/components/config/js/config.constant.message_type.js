/**
 * 定义消息类型类型
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'messageTypeObj', {
            all         : {
                value   : -1,
                name    :'全部'
            },
            systemMessage : {
                value   : 0,
                name    : '系统消息'
            },
            feedback    : {
                value   : 1,
                name    : '反馈回复'
            }
        })
        .constant('messageTypeArr',[
            {
                value:-1,
                name:'全部'
            },{
                value:0,
                name:'系统消息'
            },{
                value:1,
                name:'反馈回复'
            }
        ]);
})();
