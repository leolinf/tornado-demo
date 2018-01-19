(function(){
    'use strict';

    angular
        .module( 'Datatao.detail' )
        .controller( 'dataDetailCtrl', dataDetailCtrl );

    dataDetailCtrl.$inject = [ '$rootScope', 'DetailFactory', 'errorCode', 'dataCategoryReverseObj', 'dataComefromObj', 'dataFormatObj', 'dataFormatReverseObj', 'countFlagObj', 'favorObj','dataDetailType','displayTypeObj','displayTypeReverseObj', 'demandPriceTypeObj', 'priceFormatReverseObj', 'reviewStatusObj', '$uibModal', '$state', '$stateParams', '$sce', '$location' ];

    function dataDetailCtrl( $rootScope, DetailFactory, errorCode, dataCategoryReverseObj, dataComefromObj, dataFormatObj, dataFormatReverseObj, countFlagObj, favorObj , dataDetailType,displayTypeObj,displayTypeReverseObj, demandPriceTypeObj, priceFormatReverseObj, reviewStatusObj, $uibModal, $state, $stateParams, $sce, $location ){
        // jshint validthis : true
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);

        vm.dataId           = $stateParams.id;
        vm.dataComefromObj  = dataComefromObj;
        vm.favorObj         = favorObj;
        vm.downloadData     = downloadData;

        vm.deleteData       = deleteData;
        vm.toEditData       = toEditData;
        vm.favorData        = favorData;
        vm.dataDetailType   = dataDetailType;
        vm.tabActive        = dataDetailType.dataDetail.value;

        vm.displayTypeObj   = displayTypeObj;
        vm.displayTypeReverseObj = displayTypeReverseObj;

        vm.demandPriceTypeObj     = demandPriceTypeObj;

        vm.priceFormatReverseObj    = priceFormatReverseObj;
        vm.dataFormatObj    = dataFormatObj;

        vm.selectDataSize = selectDataSize;

        vm.isFromMyData = ( typeof $stateParams.isFromMyData === 'undefined' ) ? false : $stateParams.isFromMyData;
        // 从url中取得的值类型都是字符串
        if( vm.isFromMyData === 'true' ){
            vm.isFromMyData = true;
        }else{
            vm.isFromMyData = false;
        }

        vm.reback = {
            value:'9',
            name:'返回样例'
        };
        //数据详情，返回样例tab切换
        vm.changeTab        = changeTab;

        active();

        function active(){            
            var getDataDetailParams = {
                dataId      : vm.dataId,
                countFlag   : countFlagObj.count.value
            };
            DetailFactory.getDataDetail( getDataDetailParams )
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.detail           = response.data;
                    if( vm.detail.displayType !== 6  ){
                        vm.detail.sample    = $sce.trustAsHtml( vm.detail.sample );
                        vm.detail.interface = $sce.trustAsHtml( vm.detail.interface );
                    }else{
                        vm.detail.sample    = eval( vm.detail.sample );
                        vm.detail.interface = eval( vm.detail.interface );
                    }
                    vm.detail.priceFormat = response.data.units;
                    vm.categoryName     = dataCategoryReverseObj[response.data.category].name;
                    vm.dataFormatName   = dataFormatReverseObj[response.data.dataFormat].name;

                    // 第三方数据
                    if( vm.detail.priceType === demandPriceTypeObj.charge.value ){
                        if( !vm.detail.cost || vm.detail.cost === '' ){
                            vm.detail.cost = '未知';
                        }
                    }else if( vm.detail.priceType === demandPriceTypeObj.discuss.value ){
                        vm.detail.cost = '面议';
                    }
                    /*
                    if( vm.detail.comeFrom === vm.dataComefromObj.thirdParty.value ){
                        if( !vm.detail.cost || vm.detail.cost === '' ){
                            vm.detail.cost = '未知';
                        }
                    }else{
                        if( vm.detail.priceType === priceTypeObj.free.value ){
                            vm.detail.cost = '免费';
                        }else if( vm.detail.priceType === priceTypeObj.discuss.value ){
                            vm.detail.cost = '面议';
                        }else{
                            vm.detail.cost = vm.detail.cost + priceFormatReverseObj[vm.detail.priceFormat].name;
                        }
                    }
                    */
                    selectDataSize();

                    //console.log("vm.detail.cost:    "+vm.detail.cost);
                }else{
                    console.log( response );
                }
            });
        }

        /**
         * 删除数据
         * @param {number} reviewStatus - 审核状态
         */
        function deleteData( reviewStatus ){
            var popOptions = {};
            if( reviewStatus === reviewStatusObj.readyForReview.value ){
                // 待审核状态
                popOptions = {
                    popMsg      : '该数据正在审核中，是否确定删除？',
                    okBtn       : '删除',
                    okBtnTheme  : 'red',
                    showCancel  : false,
                    headTitle   : '提示',
                };
            }else if( reviewStatus === reviewStatusObj.notPass.value || reviewStatus === reviewStatusObj.released.value){
                // 未通过或者已发布
                popOptions = {
                    popMsg      : '是否确定删除该条数据？',
                    okBtn       : '删除',
                    okBtnTheme  : 'red',
                    showCancel  : false,
                    headTitle   : '提示',
                };
            }
            popLayer( popOptions, function( resultObj ){
                if( resultObj.status ){
                    DetailFactory.deleteData({
                        dataId : vm.dataId
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
         * 编辑数据
         */
        function toEditData(){
            $state.go( 'userCenter.edit_data', { dataId : vm.dataId } );
        }

        /**
         * 收藏/取消收藏数据
         */
        function favorData( favor ){
            if( $rootScope.isLogin ){
                var favorDataParams = {
                    dataId  : vm.dataId,
                    favor   : favor
                };
                DetailFactory.favorData( favorDataParams )
                .then( function( response ){
                    if( response.errorCode === errorCode.SUCCESS ){
                        vm.detail.isFavored = favor;
                    }else{
                        console.log( response );
                    }
                });
            }else{
                var popOptions = {
                    popMsg      : '<p>嗨，您还没有登录哟！</p><p class="m-b-md">快去登录吧。</p>',
                    okBtn       : '马上登录',
                    showCancel  : false,
                    headTitle   : '请先登录'
                };
                popLayer( popOptions, function( resultObj ){
                    if( resultObj.status ){
                        $state.go( 'signIn' );
                    }
                });
            }
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

        /**
         * 改变tab标签样式
         * @param  {[type]} tabValue [description]
         * @return {[type]}          [description]
         */
        function changeTab(tabValue){
            vm.tabActive = tabValue;
        }

        /**
         * 下载数据
         */
        function downloadData(){
            if( $rootScope.isLogin ){
                DetailFactory.getDownloadLink({
                    baseUrl : vm.detail.attachment
                })
                .then( function( response ){
                    if( response.errorCode === errorCode.SUCCESS ){
                        window.location.href = response.data.privateUrl;
                    }else{
                        console.log( response );
                    }
                });
            }else{
                var popOptions = {
                    popMsg  : '<p>嗨，下载数据需要您先登录哟！</p><p class="m-b-md">给您带来不便，非常抱歉</p>',
                    okBtn       : '马上登录',
                    showCancel  : false,
                    headTitle   : '请先登录'
                };
                popLayer( popOptions, function( resultObj ){
                    if( resultObj.status ){
                        $state.go( 'signIn' );
                    }
                });
            }
        }


        /**
         * 选择数据大小
         */
        function selectDataSize(){
            // console.log(vm.detail);
            // vm.detail.dataSize = 232323223;
            if(parseInt(vm.detail.dataSize) > 0){
                vm.dataSizeOrRows = '数据大小：'+vm.detail.dataSize + 'B';
            }else{
                vm.dataSizeOrRows = '数据条数：'+vm.detail.rows+' 条';
            }
        }


    }
})();
