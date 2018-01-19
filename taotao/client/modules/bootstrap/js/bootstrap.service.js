;(function(){
    'use strict';

    angular
        .module( 'Datatao.bootstrap' )
        .factory( 'IndexFactory', IndexFactory );

    IndexFactory.$inject = [ '$http' ];

    function IndexFactory( $http ){
        return {
            getRank : getRank
        };

        /**
         * 获取排行榜
         */
        function getRank( params ){
            //return $http.get( '/json_data/index.mock.json', {
            return $http.get( '/v3/api/index', {
                params : params
            })
            .then( function( response ){
                return response.data;
            });
        }
    }
})();
