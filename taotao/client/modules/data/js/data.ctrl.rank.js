/**
 * 数据排行榜
 */
(function(){
    'use strict';

    angular
        .module( 'Datatao.data' )
        .controller( 'dataRankCtrl', dataRankCtrl );
    
    dataRankCtrl.$inject = [ 'DataFactory', 'defaults', 'errorCode' ];

    function dataRankCtrl( DataFactory, defaults, errorCode ){
        // jshint validthis: true
        var vm = this;

        active();

        function active(){
            getHotRankData();
            getDownloadRankData();
        }

        /**
         * 获取热门排行榜数据
         */
        function getHotRankData(){
            DataFactory.getHotRank({
                count   : defaults.rankCount,
                start   : defaults.pageStart
            })
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.hotRankList = response.data.dataList;
                }else{
                    console.log( response );
                }
            });
        }

        /**
         * 获取最新下载数据
         */
        function getDownloadRankData(){
            DataFactory.getDownloadRank({
                count   : defaults.rankCount,
                start   : defaults.pageStart
            })
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.downloadRankList = response.data.dataList;
                }else{
                    console.log( response );
                }
            });
        }
    }
})();
