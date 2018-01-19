(function(){
    'use strict';

    angular
        .module( 'Datatao.data' )
        .factory( 'DataFactory', DataFactory );

    DataFactory.$inject = [ '$http' ];

    function DataFactory( $http ){
        return {
            getList                 : getList,
            getHotRank              : getHotRank,
            getDownloadRank         : getDownloadRank,
            getCategoryDataCount    : getCategoryDataCount
        };

        /**
         * 获取列表数据
         */
        function getList( params ){
            //return $http.get( '/json_data/data_search.mock.json', {
            return $http.get( '/v3/api/data/search', {
                params : params
            })
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 获取热门数据排行
         * @param {Object} params - 获取热门数据的参数
         * @param {number} params.count - 获取排行榜数组的长度
         * @param {number} params.start - 获取排行榜数组的起始位置
         */
        function getHotRank( params ){
            //return $http.get( '/json_data/data_rank_hot.mock.json', {
            return $http.get( '/v3/api/data/hot', {
                params  : params
            })
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 获取最新下载排行
         * @param {Object} params - 获取最新下载排行的参数
         * @param {number} params.count - 获取排行榜数组的长度
         * @param {number} params.start - 获取排行榜数组的起始位置
         */
        function getDownloadRank( params ){
            //return $http.get( '/json_data/data_rank_download.mock.json', {
            return $http.get( '/v3/api/data/attachment', {
                params  : params
            })
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 获取各数据分类下数据量
         */
        function getCategoryDataCount(){
            //return $http.get( '/v3/api/data/category', function(){
            //return $http.get( '/json_data/data_category_count.mock.json' )
            return $http.get( '/v3/api/data/category' )
            .then( function( response ){
                return response.data;
            });
        }

    }
})();
