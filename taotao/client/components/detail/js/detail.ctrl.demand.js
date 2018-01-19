(function(){
    'use strict';

    angular
        .module( 'Datatao.detail' )
        .controller( 'demandDetailCtrl', demandDetailCtrl );

    demandDetailCtrl.$inject = [ '$rootScope', 'DetailFactory', 'errorCode', '$stateParams', 'dataCategoryReverseObj', 'dataComefromObj', 'dataFormatReverseObj' ,'demandPriceTypeObj', 'reviewStatusObj', '$uibModal', '$state', '$location' ];

    function demandDetailCtrl( $rootScope, DetailFactory, errorCode, $stateParams, dataCategoryReverseObj, dataComefromObj, dataFormatReverseObj ,demandPriceTypeObj, reviewStatusObj, $uibModal, $state, $location ){
        // jshint validthis : true
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);

        vm.demandId         = $stateParams.id;
        vm.dataComefromObj  = dataComefromObj;
        vm.deleteDemand     = deleteDemand;
        vm.editDemand       = editDemand;
        vm.reviewStatusObj  = reviewStatusObj;

        vm.isFromMyDemand = ( typeof $stateParams.isFromMyDemand === 'undefined' ) ? false : $stateParams.isFromMyDemand;
        // 从url中取得的值类型都是字符串
        if( vm.isFromMyDemand === 'true' ){
            vm.isFromMyDemand = true;
        }else{
            vm.isFromMyDemand = false;
        }

        active();

        function active(){
            DetailFactory.getDemandDetail({ demandId : vm.demandId })
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.detail           = response.data;
                    //console.log("response.data.category:   "+response.data.category);
                    vm.categoryName     = dataCategoryReverseObj[response.data.category].name;
                    //vm.dataFormatName   = dataFormatReverseObj[response.data.dataFormat].name;
                    if(vm.detail.priceType !== demandPriceTypeObj.charge.value){
                        vm.detail.cost = "面议";
                    }else{
                        vm.detail.cost = "￥"+vm.detail.cost;
                    }
                }else{
                    console.log( response );
                }
            });
        }

        /**
         * 删除定制
         * @param {number} reviewStatus - 审核状态
         */
        function deleteDemand( reviewStatus ){
            var popOptions = {};
            if( reviewStatus === reviewStatusObj.readyForReview.value ){
                console.log( 'reviewing' );
                // 待审核状态
                popOptions = {
                    popMsg      : '该定制正在审核中，是否确定删除？',
                    okBtn       : '删除',
                    okBtnTheme  : 'red',
                    showCancel  : false,
                    headTitle   : '提示',
                };
            }else if( reviewStatus === reviewStatusObj.notPass.value || reviewStatus === reviewStatusObj.released.value){
                // 未通过或者已发布
                popOptions = {
                    popMsg      : '是否确定删除该条定制？',
                    okBtn       : '删除',
                    okBtnTheme  : 'red',
                    showCancel  : false,
                    headTitle   : '提示',
                };
            }

            popLayer( popOptions, function( result ){
                if( result.status ){
                    DetailFactory.deleteDemand({
                        demandId : vm.detail.id
                    })
                    .then( function( response ){
                        if( response.errorCode === errorCode.SUCCESS ){
                            $state.go( $rootScope.prevState, $rootScope.prevStateParams );
                        }else{
                            popLayer({
                                popMsg      : '删除失败，请稍后再试',
                                okBtn       : '确定',
                                showCancel  : false
                            }, function(){
                            });
                        }
                    });
                }
            });
        }

        /**
         * 前往定制编辑
         * @param {string} id - 要编辑的定制的唯一标识
         */
        function editDemand( id ){
            $state.go( 'userCenter.edit_demand', { demandId : id });
        }

        /**
         * 弹出层调用
         * @param {Object} popOptions   - 弹出层传入的参数对象
         * @param {function} callback   - 弹出层关闭时候回调函数
         */
        function popLayer( popOptions, callback ){
            var modalInstance = $uibModal.open({
                animation       : true,
                templateUrl     : '/components/poplayer/poplayer.normal.html',
                controller      : 'poplayerNormalCtrl',
                controllerAs    : 'vm',
                resolve         : {
                    popInData   : function(){
                        return popOptions;
                    }
                }
            });
            modalInstance.result.then( function( resultObj ){
                callback( resultObj );
            });
        }
    }
})();
