/**
 * 数据列表筛选
 */
(function(){
    'use strict';

    angular
        .module( 'Datatao.data' )
        .controller( 'dataListCtrl', dataListCtrl );

    dataListCtrl.$inject = [ '$window', '$scope', 'SearchParams', 'DataFactory', 'errorCode', 'defaults', 'dataFormatObj', 'dataFormatArr', 'priceTypeObj', 'priceTypeArr', 'hasAttachmentObj', 'hasAttachmentArr', 'dataOrderArr', 'dataOrderObj', 'dataComefromObj', 'dataCategoryObj', '$state', '$stateParams', '$location', '$sce' ];

    function dataListCtrl( $window, $scope, SearchParams, DataFactory, errorCode, defaults, dataFormatObj, dataFormatArr, priceTypeObj, priceTypeArr, hasAttachmentObj, hasAttachmentArr, dataOrderArr, dataOrderObj, dataComefromObj, dataCategoryObj, $state, $stateParams, $location, $sce ){
        // jshint validthis: true
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);

        vm.SearchParams                 = SearchParams;

        // 数据格式相关
        vm.dataFormatArr                = dataFormatArr;
        vm.dataFormatObj                = dataFormatObj;
        vm.setDataFormat                = setDataFormat;

        // 数据标价方式相关
        vm.priceTypeArr                 = priceTypeArr;
        vm.priceTypeObj                 = priceTypeObj;
        vm.setPriceType                 = setPriceType;

        // 数据可下载性相关
        vm.hasAttachmentArr            = hasAttachmentArr;
        vm.hasAttachmentObj            = hasAttachmentObj;
        vm.setHasAttachment            = setHasAttachment;

        // 数据排序相关
        vm.dataOrderArr                 = dataOrderArr;
        vm.dataOrderObj                 = dataOrderObj;
        vm.setDataOrder                 = setDataOrder;

        // 数据来源相关
        vm.dataComefromObj              = dataComefromObj;

        vm.isLoading                    = true;

        active();

        function active(){
            init();
            
            var searchParams = setSearchParams( SearchParams );
            getDataList( searchParams );
            /*
            getDataList({
                count : defaults.pageCount
            });
            */
        }

        /**
         * 初始化筛选条件和排序规则
         */
        function init(){
            SearchParams.selectedDataFormat = vm.selectedDataFormat           = ( typeof $stateParams.dataFormat === 'undefined' ) ?  dataFormatObj.all.value : Number( $stateParams.dataFormat );              // 当前选中的数据格式，默认为全部
            SearchParams.selectedPriceType = vm.selectedPriceType            = ( typeof $stateParams.priceType === 'undefined' ) ? priceTypeObj.all.value : Number( $stateParams.priceType );               // 当前选中标价方式
            SearchParams.selectedHasAttachment = vm.selectedHasAttachment       = ( typeof $stateParams.hasAttachment === 'undefined' ) ? hasAttachmentObj.all.value : Number( $stateParams.hasAttachment );          // 当前选中的数据属性（有附件无附件）
            SearchParams.selectedDataOrder = vm.selectedDataOrder            = ( typeof $stateParams.order === 'undefined' ) ? dataOrderObj.all.value : Number( $stateParams.order );
            SearchParams.count = ( typeof $stateParams.count === 'undefined' ) ? defaults.pageCount : $stateParams.count;
            SearchParams.page = ( typeof $stateParams.page === 'undefined' ) ? defaults.curPage: Number( $stateParams.page );
            SearchParams.start = ( SearchParams.page - 1 )*SearchParams.count;

            if( typeof $stateParams.content !== 'undefined' && $stateParams.content.trim() !== '' ){
                SearchParams.content = $stateParams.content;
            }
        }

        /**
         * 获取数据提供给views层展示
         * @param {Object}  paramObj            - 查询参数对象
         * @param {number}  paramObj.category   - 数据分类
         * @param {number}  paramObj.comeFrom   - 数据来源
         * @param {string}  paramObj.content    - 查询文本内容
         * @param {number}  paramObj.count      - 要求每页返回数量
         * @param {number}  paramObj.dataFormat - 数据格式
         * @param {number}  paramObj.price      - 标价方式
         * @param {number}  paramObj.start      - 请求数据开始位置
         * @param {string}  paramObj.tag        - 标签
         */
        function getDataList( params ){
            vm.isLoading    = true;

            DataFactory.getList( params )
            .then( function( response ){

                vm.isLoading    = false;

                if( response.errorCode === errorCode.SUCCESS ){
                    vm.dataList = response.data.dataList;
                    for( var i in response.data.dataList ){
                        vm.dataList[i].intro = $sce.trustAsHtml( response.data.dataList[i].intro );
                        vm.dataList[i].title = showSearchKeyword( response.data.keywords, response.data.dataList[i].title );
                    }
                    vm.dataList     = response.data.dataList;
                    vm.dataTotal    = response.data.total;
                    vm.pageTotal    = Math.ceil( vm.dataTotal/SearchParams.count );
                }else{
                    console.log( response );
                }
            });
        }

        /**
         * 通过关键词列表转换简单文本为富文本
         */
        function showSearchKeyword( keywords, content ){
            if( keywords.length === 0 || content.length === 0 ){
                return $sce.trustAsHtml( content );
            }else{
                var newStr = content;
                for( var i = 0; i < keywords.length; i++ ){
                    var pattern = new RegExp( keywords[i], 'g' );
                    newStr = newStr.replace( pattern, '<span class="search-keywords text-lg">TOBEREPLACEDWORD' + i +'</span>' );
                }
                // 不在上一个循环中进行替换是防止传入的数组中的词存在互相包含的情况，
                // 比如传入的数组是['网络数据','数据'],最后可能就会得到形如
                // '<span>网络<span>数据</span></span>'的字符串
                for( var j = 0 ; j < keywords.length; j++ ){
                    var regex = new RegExp( 'TOBEREPLACEDWORD' + j, 'g' );
                    newStr = newStr.replace( regex, keywords[j] );
                }
                return $sce.trustAsHtml( newStr );
            }
        }


        /**
         * 设置当前选中的数据格式
         * @param {number}  dataFormat - 被选中的数据格式
         */
        function setDataFormat( dataFormat ){
            //SearchParams.selectedDataFormat = vm.selectedDataFormat = dataFormat;
            SearchParams.start              = defaults.pageStart;
            SearchParams.count              = defaults.pageCount;
            SearchParams.page               = defaults.curPage;
            SearchParams.selectedDataFormat = dataFormat;

            /*
            var stateParams         = $stateParams;
            stateParams.dataFormat  = dataFormat;
            stateParams.start       = defaults.pageStart;
            stateParams.count       = defaults.pageCount;
            stateParams.page        = defaults.curPage;

            $state.go( 'dataList', stateParams, { notify : false } );
            */
        }

        /**
         * 设置当前选中的数据格式
         * @param {number}  priceType - 被选中的数据格式
         */
        function setPriceType( priceType ){
            //SearchParams.selectedPriceType = vm.selectedPriceType = priceType;
            SearchParams.start              = defaults.pageStart;
            SearchParams.count              = defaults.pageCount;
            SearchParams.page               = defaults.curPage;
            SearchParams.selectedPriceType = priceType;

            /*
            var stateParams         = $stateParams;
            stateParams.priceType   = priceType;
            stateParams.start       = defaults.pageStart;
            stateParams.count       = defaults.pageCount;
            stateParams.page        = defaults.curPage;

            $state.go( 'dataList', stateParams, { notify : false } );
            */
        }

        /**
         * 设置当前选中的下载属性
         * @param {number} hasAttachment - 被选中的下载属性
         */
        function setHasAttachment( hasAttachment ){
            //SearchParams.selectedHasAttachment = vm.selectedHasAttachment = hasAttachment;
            SearchParams.start              = defaults.pageStart;
            SearchParams.count              = defaults.pageCount;
            SearchParams.page               = defaults.curPage;
            SearchParams.selectedHasAttachment = hasAttachment;

            /*
            var stateParams             = $stateParams;
            stateParams.hasAttachment   = hasAttachment;
            stateParams.start           = defaults.pageStart;
            stateParams.count           = defaults.pageCount;
            stateParams.page            = defaults.curPage;

            $state.go( 'dataList', stateParams, { notify : false } );
            */
        }

        /**
         * 设置当前选中的数据排序规则
         */
        function setDataOrder( dataOrder ){
            //SearchParams.selectedDataOrder = vm.selectedDataOrder = dataOrder;
            SearchParams.start              = defaults.pageStart;
            SearchParams.count              = defaults.pageCount;
            SearchParams.page               = defaults.curPage;
            SearchParams.selectedDataOrder  = dataOrder;

            /*
            var stateParams         = $stateParams;
            stateParams.order       = dataOrder;
            stateParams.start       = defaults.pageStart;
            stateParams.count       = defaults.pageCount;
            stateParams.page        = defaults.curPage;

            $state.go( 'dataList', stateParams, { notify : false } );
            */
        }

        /**
         * 设置查询参数
         * @params {Object} SearchParams - 查询参数对象
         */
        function setSearchParams( SearchParams ){
            var params = {
                page    : SearchParams.page,
                start   : ( SearchParams.page - 1 ) * SearchParams.count,
                count   : SearchParams.count,
            };
            if( SearchParams.selectedDataFormat !== dataFormatObj.all.value ){
                params.dataFormat = SearchParams.selectedDataFormat;
            }
            if( SearchParams.selectedPriceType !== priceTypeObj.all.value ){
                params.priceType = SearchParams.selectedPriceType;
            }
            if( SearchParams.selectedHasAttachment !== hasAttachmentObj.all.value ){
                params.hasAttachment = SearchParams.selectedHasAttachment;
            }
            if( SearchParams.selectedDataOrder !== dataOrderObj.all.value ){
                params.order = SearchParams.selectedDataOrder;
            }
            if( SearchParams.selectedDataCategory !== dataCategoryObj.all.value ){
                params.category = SearchParams.selectedDataCategory;
            }
            if( SearchParams.content.trim() !== '' ){
                params.content = SearchParams.content;
            }
            return params;
        }

        $scope.$watch( 'vm.SearchParams', function( newValue, oldValue ){
            if( newValue !== oldValue ){
                vm.selectedDataFormat           = ( typeof SearchParams.selectedDataFormat === 'undefined' ) ?  dataFormatObj.all.value : Number( SearchParams.selectedDataFormat );              // 当前选中的数据格式，默认为全部
                vm.selectedPriceType            = ( typeof SearchParams.selectedPriceType === 'undefined' ) ? priceTypeObj.all.value : Number( SearchParams.selectedPriceType );               // 当前选中标价方式
                vm.selectedHasAttachment       = ( typeof SearchParams.selectedHasAttachment === 'undefined' ) ? hasAttachmentObj.all.value : Number( SearchParams.selectedHasAttachment );          // 当前选中的数据属性（有附件无附件）
                vm.selectedDataOrder            = ( typeof SearchParams.selectedDataOrder === 'undefined' ) ? dataOrderObj.all.value : Number( SearchParams.selectedDataOrder );

                var searchParams = setSearchParams( SearchParams );

                getDataList( searchParams );

                $window.scrollTo( 0, 0 );

                $state.go( 'dataList', searchParams , { notify : false, inherit : false } );
            }

            //$state.go( 'dataList', searchParams , { notify : false, inherit : false } );
        }, true );

    }
})();
