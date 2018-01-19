/**
 * 用户发布和编辑数据
 */
(function(){
    'use strict';

    angular
        .module( 'Datatao.userCenter' )
        .controller( 'myDemandListCtrl', myDemandListCtrl );

    myDemandListCtrl.$inject = [ '$scope', 'MyDemandFactory', 'errorCode', 'defaults', 'reviewStatusArr', 'reviewStatusReverseObj', 'reviewStatusObj', '$state', '$stateParams' ];

    function myDemandListCtrl( $scope, MyDemandFactory, errorCode, defaults, reviewStatusArr, reviewStatusReverseObj, reviewStatusObj, $state, $stateParams ){
        // jshint validthis : true
        var vm = this;

        vm.reviewStatusArr          = reviewStatusArr;
        vm.reviewStatusReverseObj   = reviewStatusReverseObj;
        vm.selectedReviewStatus     = reviewStatusObj.all.value;
        vm.viewDemandDetail         = viewDemandDetail;
        vm.onReviewStatusChange     = onReviewStatusChange;

        vm.getMyDemandList        = getMyDemandList;

        active();

        function active(){
            init();
            getMyDemandList( vm.getMyDemandParams );
        }

        /**
         * 初始化请求参数
         */
        function init(){
            vm.getMyDemandParams = {
                count           : ( typeof $stateParams.count === 'undefined' ) ? defaults.pageCount : $stateParams.count,
                page            : ( typeof $stateParams.page === 'undefined' ) ? defaults.curPage : $stateParams.page,
                reviewsStatus   : ( typeof $stateParams.reviewStatus === 'undefined' ) ? vm.selectedReviewStatus : $stateParams.reviewStatus
            };
            vm.getMyDemandParams.start = ( vm.getMyDemandParams.page - 1 ) * vm.getMyDemandParams.count;
        }

        /**
         * 获取的我的数据列表
         */
        function getMyDemandList( params ){
            MyDemandFactory.getMyDemandList( params )
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.demandList   = response.data.demandList;
                    vm.totalCreate  = response.data.totalRelease;
                    vm.pageTotal    = Math.ceil( response.data.total/vm.getMyDemandParams.count );
                }else{
                    console.log( response );
                }
            });
        }

        /**
         * 状态发生改变的时候触发函数
         */
        function onReviewStatusChange( selectedOptionIndex ){
            vm.getMyDemandParams.page         = defaults.curPage;
            vm.getMyDemandParams.start        = defaults.pageStart;
            vm.getMyDemandParams.count        = defaults.pageCount;
            vm.getMyDemandParams.reviewStatus = vm.selectedReviewStatus;
        }

        /**
         * 访问数据详情
         * @param {string} id           - 数据的唯一标识
         * @param {number} reviewStatus - 数据的审核状态 
         */
        function viewDemandDetail( id, reviewStatus ){
            $state.go( 'demandDetail', { id : id, isFromMyDemand : true} );
        }

        /**
         * 设置请求我的定制列表参数
         */
        function setMyDemandParams( myDemandParams ){
            var params = {
                page            : myDemandParams.page,
                start           : ( myDemandParams.page - 1 ) * myDemandParams.count,
                count           : myDemandParams.count,
                reviewStatus    : myDemandParams.reviewStatus,
            };
            return params;
        }

        $scope.$watch( 'vm.getMyDemandParams', function( newValue, oldValue ){
            if( newValue !== oldValue ){
                var myDemandParams = setMyDemandParams( vm.getMyDemandParams );

                getMyDemandList( myDemandParams );
                $state.go( $state.current.name, vm.getMyDemandParams, { notify : false, inherit : false } );
            }
        }, true );
    }
})();
