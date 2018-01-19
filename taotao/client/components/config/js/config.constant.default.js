/**
 * 定义常用变量的默认值
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'defaults', {
            pageCount       : 10,                       // 获取列表下条目的数量
            rankCount       : 10,                       // 排行榜默认获取列表条目数
            pageStart       : 0,                        // 分页起始位置
            curPage         : 1,                        // 初始选中页码
            order           : 1,                        // 数据排序规则
            dataTitleLimit  : 30,                       // 数据标题长度限制
            tagnumLimit     : 5,                        // 标签编辑器中标签数量限制
            tagwordLimit    : 5,                        // 标签编辑器中每一个标签中文字限制
        });

})();
