(function(){
    'use strict';

    angular
        .module( 'Datatao.detail' )
        .factory( 'DetailFactory', DetailFactory );
    
    DetailFactory.$inject = [ '$http' ];

    function DetailFactory( $http ){
        return {
            getDataDetail   : getDataDetail,
            getDemandDetail : getDemandDetail,
            getDownloadLink : getDownloadLink,
            deleteData      : deleteData,
            deleteDemand    : deleteDemand,
            favorData       : favorData,
        };

        /**
         * 获取需求详情
         * @param {Object} params - 参数对象
         * @param {string} dataId - 数据id
         */
        function getDataDetail( params ){
            //var url = '/json_data/data_detail.mock.json';
            var url = '/v3/api/data/' + params.dataId;
            return $http.get( url, {
                params   : {
                    countFlag   : params.countFlag
                }
            })
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 获取需求详情
         */
        function getDemandDetail( params ){
            // var url = '/v3/api/demand/' + params.demandId;
            var url = '/v3/api/demand/' + params.demandId;
            return $http.get( url )
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 删除数据
         * @param {Object} params           - 删除数据传递参数对象
         * @param {string} params.demandId  - 要删除的数据的唯一标识
         */
        function deleteData( params ){
            return $http.post( '/v3/api/user/data/offline', params )
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 删除定制
         * @param {Object} params           - 删除定制传递参数对象
         * @param {string} params.demandId  - 要删除的定制的唯一标识
         */
        function deleteDemand( params ){
            return $http.post( '/v3/api/user/demand/offline', params )
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 收藏/取消收藏数据
         */
        function favorData( params ){
            return $http.post( '/v3/api/user/favorite', params )
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 获取下载链接
         */
        function getDownloadLink( params ){
            return $http.get( '/v3/api/getAttachmentURI', {
                params : params
            })
            .then( function( response ){
                return response.data;
            });
        }
    }
})();
