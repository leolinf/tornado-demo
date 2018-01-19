/**
 * 首页控制器
 */

;(function(){
    'use strict';
    angular
        .module( 'Datatao.bootstrap' )
        .controller( 'indexCtrl', indexCtrl );

    indexCtrl.$inject = [ 'IndexFactory', 'errorCode', 'defaults', 'dataCategoryObj', 'dataCategoryReverseObj', 'dataCategoryArr', 'dataOrderObj', 'hasAttachmentObj', '$scope', '$location' ];

    function indexCtrl( IndexFactory, errorCode , defaults, dataCategoryObj, dataCategoryReverseObj, dataCategoryArr, dataOrderObj, hasAttachmentObj, $scope, $location ){
        // jshint validthis: true 
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);

        vm.showingCategory          = dataCategoryObj.socialNetwork.value;
        vm.setShowingCategory       = setShowingCategory;

        vm.showHotArea              = false;
        vm.showContent              = dataCategoryObj.socialNetwork.value;
        vm.showHotWordArea          = showHotWordArea;
        vm.hideHotWordArea          = hideHotWordArea;
        vm.showHotWord              = showHotWord;
        vm.dataCategoryObj          = dataCategoryObj;
        vm.dataCategoryReverseObj   = dataCategoryReverseObj;
        vm.dataCategoryArr          = dataCategoryArr;
        vm.dataOrderObj             = dataOrderObj;
        vm.hasAttachmentObj        = hasAttachmentObj;

        activate();

        function activate(){
            getRankData();
        }

        /**
         * 获取排行榜数据
         * @params {Number} -rankCount 获取列表长度
         */
        function getRankData( rankCount ){
            var count = rankCount || defaults.rankCount;
            IndexFactory.getRank({
                count : count  
            })
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.hotRank              = response.data.hotRank;
                    vm.attachmentRank       = response.data.attachmentRank;
                    vm.dataGather           = response.data.dataGather;
                    vm.dataTotal            = response.data.dataTotal;
                    vm.lastUpdateDataNum    = response.data.lastUpdateDataNum;
                    vm.lastUpdateTime       = response.data.lastUpdateTime;
                }else{
                    console.log( response );
                }
            });
        }

        /*显示关键字区域*/
        function showHotWordArea(){
        	vm.showHotArea = true;
        }
        /*隐藏关键字区域*/
        function hideHotWordArea(){
        	vm.showHotArea = false;
        }
        /*显示某个关键字具体的区域*/
        function showHotWord(num){
        	//vm.showContent = num;
        }

        /**
         * 设置要显示的标签对应的分类
         */
        function setShowingCategory( category ){
            vm.showingCategory = category;
        }

    }
})();
