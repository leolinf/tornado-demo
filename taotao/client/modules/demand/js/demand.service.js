(function(){
    'use strict';

    angular
        .module( 'Datatao.demand' )
        .factory( 'DemandFactory', DemandFactory );

    DemandFactory.$inject = [ '$http' ];

    function DemandFactory( $http ){
        return {
            getList : getList
        };

        /**
         * 获取需求列表
         * @param {Object} params - 获取需求列表的参数对象
         * @param {number} params.category  - 数据分类
         * @param {number} params.count     - 获取的一页列表数目 
         * @param {number} params.order     - 需求排序规则
         * @param {number} params.start     - 获取需求列表的起始位置
         */
        function getList( params ){
            //return $http.get( '/json_data/demand_list.mock.json', {
            return $http.get( '/v3/api/demand', {
                params : params
            })
            .then( function( response ){
                return response.data;
            });
        }
    }
})();
