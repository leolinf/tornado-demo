;(function(){
    'use strict';

    angular
        .module( 'Datatao.header' )
        .directive( 'headerSearch', headerSearch );

    headerSearch.$inject = [ '$state', '$stateParams', 'SearchParams', 'SearchDemandParams', 'dataCategoryObj', 'dataFormatObj', 'priceTypeObj', 'hasAttachmentObj', 'dataOrderObj', 'defaults' ];

    function headerSearch( $state, $stateParams, SearchParams, SearchDemandParams, dataCategoryObj, dataFormatObj, priceTypeObj, hasAttachmentObj, dataOrderObj, defaults ){
        var directive = {
            restrict : 'EA',
            scope : {
                isSearchDemand : '='
            },
            replace : true,
            templateUrl : '/components/header/header_search.tpl.html',
            link : link
        };

        return directive;

        function link( scope, element, attrs ){

            /* 搜数据 */
            scope.searchDataByContent   = searchDataByContent;
            scope.SearchParams          = SearchParams;
            scope.searchData            = searchData;

            /* 搜需求 */
            scope.searchDemandByContent = searchDemandByContent;
            scope.demandContent         = "";
            scope.searchDemand          = searchDemand;

            /*
            if( typeof $stateParams.content  !== 'undefined' ){
                scope.searchContent = $stateParams.content;
            }
            */

            /**
             * 按搜索框输入的内容搜索数据
             */
            function searchDataByContent(){
                //SearchParams.content = scope.searchContent;
                // 重置筛选和排序条件
                SearchParams.resetFilter();

                var stateParams = $stateParams;
                stateParams.category        = dataCategoryObj.all.value;
                stateParams.dataFormat      = dataFormatObj.all.value;
                stateParams.priceType       = priceTypeObj.all.value;
                stateParams.hasAttachment   = hasAttachmentObj.all.value;
                stateParams.dataOrder       = dataOrderObj.all.value;
                stateParams.start           = defaults.pageStart;
                stateParams.count           = defaults.pageCount;

                if( $state.is( 'dataList' ) ){
                    $state.go( 'dataList', { content : SearchParams.content }, { notify : false });
                }else{
                    $state.go( 'dataList', { content : SearchParams.content } );
                }
            }

            /**
             * 监听键盘enter事件，进行数据搜索
             */
            function searchData( e ){
                if( e.keyCode === 13 ){
                    searchDataByContent();
                }
            }
        
            /**
             * 按搜索框输入的内容搜需求
             */
            function searchDemandByContent(){
                var stateParams = $stateParams;
            }

            /**
             * 监听键盘事件
             */
            function searchDemand( e ){
                if( e.keyCode === 13 ){
                    scope.searchDemandByContent();
                }
            }

        }
    }
})();
