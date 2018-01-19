(function(){
    'use strict';

    angular
        .module( 'Datatao.data' )
        .controller( 'dataCategoryCtrl', dataCategoryCtrl );

    dataCategoryCtrl.$inject = [ '$scope', 'SearchParams', 'DataFactory', 'errorCode', 'defaults', 'dataCategoryArr', 'dataCategoryObj', 'dataFormatObj', 'priceTypeObj', 'hasAttachmentObj', 'dataOrderObj', '$state', '$stateParams' ];

    function dataCategoryCtrl( $scope, SearchParams, DataFactory, errorCode, defaults, dataCategoryArr, dataCategoryObj, dataFormatObj, priceTypeObj, hasAttachmentObj, dataOrderObj, $state, $stateParams ){
        // jshint validthis : true
        var vm = this;

        vm.dataCategoryArr      = dataCategoryArr;
        vm.dataCategoryObj      = dataCategoryObj;
        vm.allDataCount         = 0;
        // 存储每个分类下的数据量
        vm.dataCategoryCount    = {};                                   

        vm.setDataCategory      = setDataCategory;
        vm.setTag               = setTag;

        active();

        function active(){
            init();
            DataFactory.getCategoryDataCount()
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    for( var i = 0 ; i < response.data.dataList.length; i++ ){
                        vm.allDataCount += response.data.dataList[i].total;
                        //vm.dataCategoryObj[response.data.dataList[i].category].total = response.data.dataList[i].total;
                        vm.dataCategoryCount[response.data.dataList[i].category] = response.data.dataList[i].total;
                    }
                }else{
                    console.log( response );
                }
            });
        }

        /**
         * 初始化分类和tag
         */
        function init(){
            vm.selectedDataCategory = SearchParams.selectedDataCategory = ( typeof $stateParams.category === 'undefined' ) ? dataCategoryObj.all.value : Number( $stateParams.category );    // 默认当前选择为社交网络
            vm.selectedTag          = SearchParams.selectedTag = ( typeof $stateParams.content === 'undefined' ) ? "" : $stateParams.content;             // 默认没有tag被选中
        }

        /**
         * 设置选中的数据分类
         * @param {number} category - 数据分类对应的编号
         */
        function setDataCategory( category ){
            SearchParams.selectedDataCategory   = vm.selectedDataCategory  = category;
            SearchParams.selectedTag            = vm.selectedTag           = "";
            SearchParams.content                = "";
            SearchParams.start                  = defaults.pageStart;
            SearchParams.count                  = defaults.pageCount;
        
            // 重置筛选和排序条件
            SearchParams.resetFilter();

            /*
            var stateParams             = $stateParams;
            stateParams.category        = category;

            // 重置url参数
            stateParams.dataFormat      = dataFormatObj.all.value;
            stateParams.priceType       = priceTypeObj.all.value;
            stateParams.hasAttachment   = hasAttachmentObj.all.value;
            stateParams.dataOrder       = dataOrderObj.all.value;
            stateParams.content         = "";
            stateParams.start           = defaults.pageStart;
            stateParams.count           = defaults.pageCount;

            $state.go( 'dataList', stateParams, { notify : false } );
            */
        }

        /**
         * 设置选中的tag
         * @param {string} tag  - 标签名
         */
        function setTag( tag ){
            if( tag === '全部' ){
                tag = "";
            }

            //SearchParams.selectedDataCategory   = vm.selectedDataCategory;
            SearchParams.content    = SearchParams.selectedTag = vm.selectedTag = tag;
            SearchParams.start      = defaults.pageStart;
            SearchParams.count      = defaults.pageCount;

            // 重置筛选和排序条件
            SearchParams.resetFilter();

            /*
            var stateParams             = $stateParams;
            stateParams.content         = tag;

            // 重置url参数
            stateParams.dataFormat      = dataFormatObj.all.value;
            stateParams.priceType       = priceTypeObj.all.value;
            stateParams.hasAttachment   = hasAttachmentObj.all.value;
            stateParams.dataOrder       = dataOrderObj.all.value;
            stateParams.start           = defaults.pageStart;
            stateParams.count           = defaults.pageCount;

            $state.go( 'dataList', stateParams, { notify : false } );
            */
        }

    }
})();
