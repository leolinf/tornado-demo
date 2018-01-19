/**
 * 我的收藏
 * @return {[type]} [description]
 */
(function(){
	'use strict';

	angular
		.module('Datatao.userCenter')
		.controller('myCollectionCtrl',myCollectionCtrl);

		myCollectionCtrl.$inject = ['$scope', 'MyCollectionFactory','errorCode','defaults', 'favorObj', '$state', '$stateParams' ];

    function myCollectionCtrl( $scope, MyCollectionFactory,errorCode,defaults,favorObj, $state, $stateParams){
        // jshint validthis:true
        var vm = this;

        //获取列表
        vm.getMyCollectionList = getMyCollectionList;

        //查看详情
        vm.viewMyCollectionDetail = viewMyCollectionDetail;

        //显示删除收藏按钮
        vm.showDelete = showDelete;
        //显示状态默认为不显示
        vm.showDeleteStatus = "";
        //隐藏删除按钮
        vm.hideDelete = hideDelete;

        //删除收藏
        vm.removeCollection = removeCollection;

        active();

        function active(){
            init();
            getMyCollectionList(vm.getMyCollectionParams);
        }

        /**
         * 初始化请求参数
         */
        function init(){
            //添加获取参数列表
            vm.getMyCollectionParams = {
                count : ( typeof $stateParams.count === 'undefined' ) ? defaults.pageCount : Number( $stateParams.count ),
                page : ( typeof $stateParams.page === 'undefined' ) ? defaults.curPage : Number( $stateParams.page ),
            };
            vm.getMyCollectionParams.start =  ( vm.getMyCollectionParams.page - 1 ) * vm.getMyCollectionParams.count;
        }

        /**
         * 获取我的收藏列表
         */
        function getMyCollectionList(params){
            MyCollectionFactory.getMyCollectionList(params)
            .then(function(response){
                if(response.errorCode === errorCode.SUCCESS){
                    vm.myCollectionList = response.data.dataList;
                    vm.total            = response.data.total;
                    vm.pageTotal        = Math.ceil( response.data.total/vm.getMyCollectionParams.count );
                }else{
                    console.log(response);
                }
            });
        }

        /**
         * 查看数据详情
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        function viewMyCollectionDetail(id){
            $state.go( 'dataDetail', { id : id, isFromMyData : false });
        }


        /**
         * 移除一条收藏记录
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        function removeCollection(id, index){
            var params = {
                dataId:id,
                favor:favorObj.notFavor.value
            };
            MyCollectionFactory.removeCollection(params)
            .then(function(response){
                if(response.errorCode === errorCode.SUCCESS){
                    if( vm.myCollectionList.length === 1 ){
                        getMyCollectionList(vm.getMyCollectionParams);
                    }else{
                        vm.myCollectionList.splice(index, 1);
                    }
                }else{
                    console.log(response);
                }
            });
        }

        $scope.$watch( 'vm.getMyCollectionParams.page', function( newValue, oldValue ){
            if( newValue !== oldValue ){

                vm.getMyCollectionParams.start = ( vm.getMyCollectionParams.page - 1 ) * vm.getMyCollectionParams.count;

                getMyCollectionList( vm.getMyCollectionParams );
                $state.go( $state.current.name, vm.getMyCollectionParams, { notify : false, inherit : false } );
            }
        });

        /**
         * 显示删除按钮
         * @param  {number} index [当前行的索引]
         */
        function showDelete(index){
            vm.showDeleteStatus = index;
        }

        /**
         * 隐藏删除按钮
         * @return {[type]} [description]
         */
        function hideDelete(){
            vm.showDeleteStatus = "";
        }


    }

})();
