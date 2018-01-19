/**
 * 我的下载列表
 */

(function(){
	'use strict';

	angular
		.module('Datatao.userCenter')
		.controller('myDownloadCtrl',myDownloadCtrl);

		myDownloadCtrl.$inject = ['$scope', 'MyDownloadFactory','errorCode','defaults','dataCategoryArr','dataCategoryObj', 'dataCategoryReverseObj', '$state', '$stateParams' ];

		/**
		 * 我的下载控制器
		 * @param  {[type]} MyDownloadFactory [description]
		 * @param  {[type]} errorCode         [description]
		 * @param  {[type]} defaults          [description]
		 * @return {[type]}                   [description]
		 */
		function myDownloadCtrl($scope, MyDownloadFactory,errorCode,defaults,dataCategoryArr,dataCategoryObj, dataCategoryReverseObj, $state, $stateParams ){
			//jshint validthis:true
			var vm = this;			
			vm.getMyDownloadList        = getMyDownloadList;
			vm.dataCategoryArr          = dataCategoryArr;
			vm.dataCategoryObj          = dataCategoryObj;
            vm.dataCategoryReverseObj   = dataCategoryReverseObj;
			vm.selectedDataCategory     = dataCategoryObj.all.value;			
            vm.onCategoryChange         = onCategoryChange;
            vm.viewMyDownloadDetail     = viewMyDownloadDetail;

			active();

			function active(){
                init();
				getMyDownloadList(vm.getMyDownloadListParams);
			}

            /**
             * 初始化参数列表
             */
            function init(){
                vm.getMyDownloadListParams = {
                    count       : ( typeof $stateParams.count === 'undefined' ) ? defaults.pageCount : $stateParams.count,
                    page        : ( typeof $stateParams.page === 'undefined' ) ? defaults.curPage : $stateParams.page,
                    category    : ( typeof $stateParams.category === 'undefined' ) ? vm.selectedDataCategory : $stateParams.category,
                };
                vm.getMyDownloadListParams.start = ( vm.getMyDownloadListParams.page - 1 ) * vm.getMyDownloadListParams.count;
            }

			/**
			 * 获取我的下载列表
			 * @param  {[type]} params [description]
			 * @return {[type]}        [description]
			 */
			function getMyDownloadList(params){
				MyDownloadFactory.getMyDownloadList(params)
				.then(function(response){
					if(response.errorCode === errorCode.SUCCESS){
						vm.myDownloadList   = response.data.dataList;
                        vm.totalDownload    = response.data.totalDownload;
                        vm.total            = response.data.total;
                        vm.pageTotal        = Math.ceil( response.data.total/vm.getMyDownloadListParams.count );
					}else{
						console.log(response);
					}
				});
			}

            /**
             * 查看数据详情
             */
            function viewMyDownloadDetail( id ){
                $state.go( 'dataDetail', { id : id, isFromMyData : false } );
            }

            /**
             * 设置我的下载列表参数
             */
            function setMyDownloadListParams( getMyDownloadListParams ){
                var params = {
                    page        : getMyDownloadListParams.page,
                    start       : ( getMyDownloadListParams.page - 1 ) * getMyDownloadListParams.count,
                    count       : getMyDownloadListParams.count,
                    category    : getMyDownloadListParams.category,
                };
                return params;
            }

            /**
             * 类型发生改变调用函数
             */
            function onCategoryChange( selectedOptionIndex ){
                vm.getMyDownloadListParams.page     = defaults.curPage;
                vm.getMyDownloadListParams.start    = defaults.pageStart;
                vm.getMyDownloadListParams.count    = defaults.pageCount;
                vm.getMyDownloadListParams.category = vm.selectedDataCategory;
            }

            $scope.$watch( 'vm.getMyDownloadListParams', function( newValue, oldValue ){
                if( newValue !== oldValue ){
                    var getMyDownloadListParams = setMyDownloadListParams( vm.getMyDownloadListParams );

                    getMyDownloadList( getMyDownloadListParams );
                    $state.go( $state.current.name, vm.getMyDownloadListParams, { notify : false, inherit : false } );
                }
            }, true );

		}
})();
