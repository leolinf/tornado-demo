/**
 * 定义数据状态
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'reviewStatusObj', {
            all             : {
                value   : -1,
                name    : '全部'
            },
            readyForReview  : {
                value   : 0,
                name    : '待审核'
            },
            /*
            offline         : {
                value   : 1,
                name    : '已下线'
            },
            */
            released        : {
                value   : 3,
                name    : '已发布'
            },
            notPass         : {
                value   : 4,
                name    : '未通过'
            },
        })
        .constant( 'reviewStatusReverseObj', {
            "-1"    : {
                name    : '全部'
            },
            "0"     : {
                name    : '待审核'
            },
            /*
            "1"     : {
                name    : '已下线'
            },
            */
            "3"     : {
                name    : '已发布'
            },
            "4"     : {
                name    : '未通过'
            }
        })
        .constant( 'reviewStatusArr', [{
            value   : -1,
            name    : '全部'
        },{
            value   : 0,
            name    : '待审核'
        /*
        },{
            value   : 1,
            name    : '已下线'
        */
        },{
            value   : 3,
            name    : '已发布'
        },{
            value   : 4,
            name    : '未通过'
        }]);
})();
