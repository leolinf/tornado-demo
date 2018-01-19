(function(){
    'use strict';

    angular
        .module( 'Datatao.demand' )
        .controller( 'demandListCtrl', demandListCtrl );

    demandListCtrl.$inject = [ '$scope', 'DemandFactory', 'errorCode', 'defaults', 'dataCategoryArr', 'dataCategoryObj', 'dataCategoryReverseObj', 'demandOrderArr', 'demandOrderObj', 'SearchDemandParams', 'demandPriceTypeObj', '$state', '$stateParams', '$location' ];

    function demandListCtrl( $scope, DemandFactory, errorCode, defaults, dataCategoryArr, dataCategoryObj, dataCategoryReverseObj, demandOrderArr, demandOrderObj, SearchDemandParams, demandPriceTypeObj, $state, $stateParams, $location ){
        // jshint validthis : true
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);

        vm.SearchDemandParams           = SearchDemandParams;

        vm.demandCategoryArr            = dataCategoryArr;
        vm.demandCategoryObj            = dataCategoryObj;
        vm.demandCategoryReverseObj     = dataCategoryReverseObj;
        vm.demandOrderArr               = demandOrderArr;

        vm.setDemandCategory            = setDemandCategory;
        vm.setDemandOrder               = setDemandOrder;
        vm.demandPriceTypeObj           = demandPriceTypeObj;

        active();

        function active(){
            init();
            var searchDemandParams = setSearchDemandParams( SearchDemandParams );
            getDemandList( searchDemandParams );
        }

        /**
         * 初始化状态
         */
        function init(){
            SearchDemandParams.selectedDemandCategory = vm.selectedDemandCategory     = ( typeof $stateParams.category === 'undefined' ) ? dataCategoryObj.all.value : Number( $stateParams.category );
            SearchDemandParams.selectedDemandOrder = vm.selectedDemandOrder      = ( typeof $stateParams.order === 'undefined' ) ? demandOrderObj.all.value : Number( $stateParams.order );
    
            if( typeof $stateParams.content !== 'undefined' && $stateParams.content.trim() !== '' ){
                SearchDemandParams.content = $stateParams.content;
            }
        }

        /**
         * 获取需求列表
         */
        function getDemandList( params ){
            DemandFactory.getList( params )
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.demandList   = response.data.demandList;
                    vm.total        = response.data.total;
                    vm.pageTotal    = Math.ceil( vm.total/SearchDemandParams.count );
                }else{
                    console.log( response );
                }
            });
        }

        /**
         * 设置数据分类
         * @param {number} demandCategory - 需求分类对应的值
         */
        function setDemandCategory( demandCategory ){
            SearchDemandParams.start                    = defaults.pageStart;
            SearchDemandParams.count                    = defaults.pageCount;
            SearchDemandParams.page                     = defaults.curPage;
            SearchDemandParams.selectedDemandCategory   = vm.selectedDemandCategory = demandCategory;

            /*
            var stateParams         = $stateParams;
            stateParams.category    = demandCategory;
            stateParams.start       = defaults.pageStart;
            stateParams.count       = defaults.pageCount;

            $state.go( 'demandList', stateParams, { notify : false });
            */
        }

        /**
         * 设置需求排序规则
         * @param {number} demandOrder  - 需求排序规则
         */
        function setDemandOrder( demandOrder ){
            SearchDemandParams.start                    = defaults.pageStart;
            SearchDemandParams.count                    = defaults.pageCount;
            SearchDemandParams.page                     = defaults.curPage;
            SearchDemandParams.selectedDemandOrder = vm.selectedDemandOrder   = demandOrder;

            /*
            var stateParams     = $stateParams;
            stateParams.order   = demandOrder;
            stateParams.start   = defaults.pageStart;
            stateParams.count   = defaults.pageCount;

            $state.go( 'demandList', stateParams, { notify : false });
            */
        }

        /**
         * 设置需求查询参数
         */
        function setSearchDemandParams( SearchDemandParams ){
            var params = {
                page    : SearchDemandParams.page,
                start   : ( SearchDemandParams.page - 1 ) * SearchDemandParams.count,
                count   : SearchDemandParams.count,
            };

            if( SearchDemandParams.selectedDemandCategory !== dataCategoryObj.all.value ){
                params.category = SearchDemandParams.selectedDemandCategory;
            }
            if( SearchDemandParams.selectedDemandOrder !== demandOrderObj.all.value ){
                params.order    = SearchDemandParams.selectedDemandOrder;
            }

            return params;
        }

        $scope.$watch( 'vm.SearchDemandParams', function( newValue, oldValue ){

            if( newValue !== oldValue ){
                vm.selectedDemandCategory   = SearchDemandParams.selectedDemandCategory;
                vm.selectedDemandOrder      = SearchDemandParams.selectedDemandOrder;

                var searchDemandParams = setSearchDemandParams( SearchDemandParams );
                getDemandList( searchDemandParams );

                $state.go( 'demandList', searchDemandParams, { notfiy : false, inherit : false } );
            }
        }, true );
    }
})();
