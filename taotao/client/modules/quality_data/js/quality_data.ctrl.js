(function(){
	'use strict';

	angular
		.module('Datatao.qualityData')
		.controller('qualityDataCtrl',qualityDataCtrl);

    qualityDataCtrl.$inject = ['$scope','$state','$stateParams','SearchParams','qualityDataCategoryArr','qualityDataCategoryReverseObj','QualityDataFactory','errorCode','priceTypeObj','dataComefromObj','qualityDataCategoryObj', 'defaults', '$location' ];

    function qualityDataCtrl($scope,$state,$stateParams,SearchParams,qualityDataCategoryArr,qualityDataCategoryReverseObj,QualityDataFactory,errorCode,priceTypeObj,dataComefromObj,qualityDataCategoryObj, defaults, $location ){
        // jshint validthis: true
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);

        vm.initSelectedTag = -1;

        //tag标签
        vm.qualityDataCategoryArr   = qualityDataCategoryArr;
        vm.qualityDataCategoryReverseObj = qualityDataCategoryReverseObj;
        //console.log("$stateParams.tag:   "+$stateParams.tag);
        vm.categoryValue            = parseInt((($stateParams.category !== "" && typeof $stateParams.category !== "undefined")?($stateParams.category):(qualityDataCategoryObj.tianmao.value)));

        //数据标价方式
        vm.priceTypeObj             = priceTypeObj;

        //数据来源
        vm.dataComeFromObj          = dataComefromObj;
        // console.log("dataComeFromObj:  "+datComeFromObj);			
        vm.qualityDataCategoryObj   = qualityDataCategoryObj;
        vm.setTagFormat             = setTagFormat;
        vm.setCategoryValue         = setCategoryValue;
        vm.selectedTag = vm.initSelectedTag;

        vm.isLoading = true;

        active();

        function active(){
            init();				
            getDataList( vm.getQualityDataParams );
        }

        /**
         * 初始化筛选条件和排序规则
         */
        function init(){
            vm.getQualityDataParams = {
                count       : ( typeof $stateParams.count === 'undefined' ) ? defaults.pageCount : $stateParams.count,
                page        : ( typeof $stateParams.page === 'undefined' ) ? defaults.curPage : $stateParams.page,
                category    : ( typeof $stateParams.category === 'undefined' ) ? vm.categoryValue : $stateParams.category,
                isSubCategory   : false
            };
            vm.getQualityDataParams.start = ( vm.getQualityDataParams.page - 1 ) * vm.getQualityDataParams.count;
        }


        /**
         * 获取数据列表
         * @param  {[type]} params [description]
         * @return {[type]}        [description]
         */
        function getDataList(params){
            vm.isLoading = true;
            QualityDataFactory.getList(params)
            .then(function(response){
                vm.isLoading = false;

                if(response.errorCode === errorCode.SUCCESS){
                    vm.qualistDataList = response.data.dataList;
                    // vm.dataTotal = response.data.total;
                    vm.pageTotal = Math.ceil( response.data.total/vm.getQualityDataParams.count );
                }else{
                    console.log(response);
                }
            });
        }

        /**
         * 设置当前选中的数据格式
         * @param {number} dataFormat 备选中的数据格式
         */
        function setTagFormat(tagFormat){
            vm.selectedTag = tagFormat;
            //category.selectedTag = tagFormat;
            if( tagFormat === vm.initSelectedTag ){
                vm.getQualityDataParams.category = vm.categoryValue;
            }else{
                vm.getQualityDataParams.category = tagFormat;
            }
            vm.getQualityDataParams.isSubCategory = true;
            vm.getQualityDataParams.start = defaults.pageStart;
            vm.getQualityDataParams.page = defaults.curPage;
            vm.getQualityDataParams.count = defaults.pageCount;
        }


        function setCategoryValue(categoryValue){
            vm.selectedTag = vm.initSelectedTag;
            vm.categoryValue = categoryValue;
            vm.getQualityDataParams.category = categoryValue;

            vm.getQualityDataParams.isSubCategory = false;

            vm.getQualityDataParams.start = defaults.pageStart;
            vm.getQualityDataParams.page = defaults.curPage;
            vm.getQualityDataParams.count = defaults.pageCount;
            //category.categoryValue = categoryValue;

            /*
            var stateParams = $stateParams;
            stateParams.tag = categoryValue;

            $state.go('qualityData',stateParams,{notify:false});
            */
        }

        /**
         * 设置获取精品数据列表的参数
         */
        function setGetQualityDataParams( getQualityDataParams ){
            var params = {
                page        : getQualityDataParams.page,
                start       : ( getQualityDataParams.page - 1 ) * getQualityDataParams.count,
                count       : getQualityDataParams.count,
                category    : getQualityDataParams.category,
            };
            return params;
        }

        //这个部分我们是要监视那些内容
        $scope.$watch('vm.getQualityDataParams',function( newValue, oldValue ){
            if( newValue !== oldValue ){
                var getQualityDataParams = setGetQualityDataParams( vm.getQualityDataParams );

                getDataList( getQualityDataParams );

                var stateParams = getQualityDataParams;
                if( stateParams.isSubCategory ){
                    // 如果当前category是指向子类别的，则不更新当前url上的类别
                    stateParams.category = ( typeof $stateParams.category === 'undefined' ) ? qualityDataCategoryObj.tianmao.value : Number( $stateParams.category );
                }
                $state.go( $state.current.name, stateParams, { notify : false, inherit : false });
            }
        },true);
    }
})();
