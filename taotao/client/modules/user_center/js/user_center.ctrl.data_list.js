/**
 * 用户发布和编辑数据
 */
(function(){
    'use strict';

    angular
        .module( 'Datatao.userCenter' )
        .controller( 'myDataListCtrl', myDataListCtrl );

    myDataListCtrl.$inject = [ '$scope', 'MyDataFactory', 'errorCode', 'defaults', 'reviewStatusArr', 'reviewStatusReverseObj', 'reviewStatusObj', '$state', '$stateParams' ];

    function myDataListCtrl( $scope, MyDataFactory, errorCode, defaults, reviewStatusArr, reviewStatusReverseObj, reviewStatusObj, $state, $stateParams ){
        // jshint validthis : true
        var vm = this;

        vm.reviewStatusArr          = reviewStatusArr;
        vm.reviewStatusReverseObj   = reviewStatusReverseObj;
        vm.selectedReviewStatus     = reviewStatusObj.all.value;
        vm.viewDataDetail           = viewDataDetail;
        vm.onReviewStatusChange     = onReviewStatusChange;

        vm.getMyDataList            = getMyDataList;

        active();

        function active(){
            init();
            getMyDataList( vm.getMyDataParams );
        }

        /**
         * 初始化请求参数
         */
        function init(){
            vm.getMyDataParams = {
                count           : ( typeof $stateParams.count === 'undefined' ) ? defaults.pageCount : $stateParams.count,
                page            : ( typeof $stateParams.page === 'undefined' ) ? defaults.curPage : $stateParams.page,
                //start           : ( typeof $stateParams.start === 'undefined' ) ? defaults.pageStart : ( vm.getMyDataParams.page - 1 )*vm.getMyDataParams.count,
                reviewsStatus   : ( typeof $stateParams.reviewStatus === 'undefined' ) ? vm.selectedReviewStatus : $stateParams.reviewStatus
            };
            vm.getMyDataParams.start = ( vm.getMyDataParams.page - 1 ) * vm.getMyDataParams.count;
        }

        /**
         * 获取的我的数据列表
         */
        function getMyDataList( params ){
            MyDataFactory.getMyDataList( params )
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.dataList     = response.data.dataList;
                    vm.totalCreate  = response.data.totalRelease;
                    vm.total        = response.data.total;
                    vm.pageTotal    = Math.ceil( response.data.total/vm.getMyDataParams.count );
                }else{
                    console.log( response );
                }
            });
        }

        /**
         * 状态选择器改变时候触发函数
         */
        function onReviewStatusChange( selectedOptionIndex ){
            vm.getMyDataParams.page         = defaults.curPage;
            vm.getMyDataParams.start        = defaults.pageStart;
            vm.getMyDataParams.count        = defaults.pageCount;
            vm.getMyDataParams.reviewStatus = vm.selectedReviewStatus;
        }

        /**
         * 访问数据详情
         * @param {string} id           - 数据的唯一标识
         * @param {number} reviewStatus - 数据的审核状态 
         */
        function viewDataDetail( id, reviewStatus ){
            $state.go( 'dataDetail', { id : id, isFromMyData : true} );
        }

        /**
         * 设置请求我的数据列表参数
         * @param {Object} myDataParams - 我的数据列表参数
         */
        function setMyDataParams( myDataParams ){
            var params = {
                page            : myDataParams.page,
                start           : ( myDataParams.page - 1 ) * myDataParams.count,
                count           : myDataParams.count,
                reviewStatus    : myDataParams.reviewStatus,
            };
            return params;
        }

        $scope.$watch( 'vm.getMyDataParams', function( newValue, oldValue ){
            if( newValue !== oldValue ){
                var myDataParams = setMyDataParams( vm.getMyDataParams );

                getMyDataList( myDataParams );
                $state.go( $state.current.name, vm.getMyDataParams, { notify : false, inherit : false } );
            }
        }, true );

    }
})();
