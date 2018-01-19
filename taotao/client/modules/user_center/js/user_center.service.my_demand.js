;(function(){
    'use strict';

    angular
        .module( 'Datatao.userCenter' )
        .factory( 'MyDemandFactory', MyDemandFactory );

    MyDemandFactory.$inject = [ '$http' ];

    function MyDemandFactory( $http ){
        return {
            saveDemand      : saveDemand,
            getMyDemandList : getMyDemandList,
        };

        /**
         * 保存需求
         * @param {Object} params           - 保存需求的参数对象
         */
        function saveDemand( params ){
            return $http.post( '/v3/api/user/demand', params )
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 获取我的需求列表
         * @param {Object} params       - 获取我的需求列表参数对象
         * @param {number} count        - 获取的列表每页数量
         * @param {number} reviewStatus - 审核状态
         * @param {number} start        - 获取的列表的起始位置
         */
        function getMyDemandList( params ){
            return $http.get( '/v3/api/user/demand',{
                params : params
            })
            .then( function( response ){
                return response.data;
            });
        }

    }
})();
