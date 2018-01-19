/**
 * 提交和编辑需求
 */
(function(){
    'use strict';

    angular
        .module( 'Datatao.userCenter' )
        .controller( 'demandEditCtrl', demandEditCtrl );

    demandEditCtrl.$inject = [ 'MyDemandFactory', 'DetailFactory', 'dataCategoryArr', 'dataCategoryObj', 'dataCategoryReverseObj', 'dataFormatArr', 'dataFormatObj', 'demandPriceTypeObj', 'demandPriceTypeArr', 'demandDeadlineObj', 'demandDeadlineArr', 'defaults', 'errorCode', '$state', '$stateParams', '$uibModal', '_' ];

    function demandEditCtrl( MyDemandFactory, DetailFactory, dataCategoryArr, dataCategoryObj, dataCategoryReverseObj, dataFormatArr, dataFormatObj, demandPriceTypeObj, demandPriceTypeArr, demandDeadlineObj, demandDeadlineArr, defaults, errorCode, $state, $stateParams, $uibModal, _ ){
        // jshint validthis : true
        var vm = this;

        vm.saveDemand   = saveDemand;

        vm.tagnumLimit  = defaults.tagnumLimit;
        vm.tagwordLimit = defaults.tagwordLimit;

        vm.error = {
            title           : {
                flag    : false,
                msg     : '数据标题不能为空且长度不能超过30个字'
            },
            tags            : {
                flag    : false,
                msg     : '数据标签不能为空'
            },
            demandPrice     : {
                flag    : false,
                msg     : '悬赏价格必须为有效的数字值'
            },
            intro           : {
                flag    : false,
                msg     : '字数不得超过300个字/数据简介不能为空'
            },
            deadline        : {
                flag    : false,
                msg     : '截止日期必须是有效的日期'
            },
            linkman         : {
                flag    : false,
                msg     : '联系人不能为空'
            },
            contact         : {
                flag    : false,
                msg     : '联系方式不正确/联系方式不能为空'
            }
        };

        vm.detail = {
            dataCategoryArr         : dataCategoryArr,
            dataCategoryReverseObj  : dataCategoryReverseObj,
            demandPriceTypeObj      : demandPriceTypeObj,
            demandPriceTypeArr      : demandPriceTypeArr,
            demandDeadlineObj       : demandDeadlineObj,
            demandDeadlineArr       : demandDeadlineArr,
        };
        /* 日历配置 */
        vm.calendarConfig = {
            showButtonBar   : true,
            popup   : {
                opened  : false 
            },
            open    : function(){
                this.popup.opened = true;
            },
            //formats : ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'],
            dateOptions : {
                showWeeks   : false
            }
        };

        active();

        function active(){
            init();
        }

        /**
         * 初始化编辑区内容
         */
        function init(){
            if( typeof $stateParams.demandId === 'undefined' ){
                vm.detail.title                 = '';
                vm.detail.category              = dataCategoryObj.socialNetwork.value;
                vm.detail.tags                  = [];
                vm.detail.demandPriceType       = demandPriceTypeObj.discuss.value;
                vm.detail.demandDeadline        = demandDeadlineObj.longtime.value;
                vm.detail.demandDeadlineTime    = "";
                vm.detail.cost                  = "";
                vm.detail.linkman               = "";
                vm.detail.contact               = "";
                vm.detail.intro                 = "";
            }else{
                DetailFactory.getDemandDetail({ demandId : $stateParams.demandId })
                .then( function( response ){
                    if( response.errorCode === errorCode.SUCCESS ){
                        vm.detail.title                 = response.data.title;
                        vm.detail.category              = response.data.category;
                        vm.detail.tags                  = response.data.tags;
                        vm.detail.demandPriceType       = response.data.priceType;
                        vm.detail.cost                  = response.data.cost;
                        vm.detail.linkman               = response.data.linkman;
                        vm.detail.contact               = response.data.contact;
                        vm.detail.intro                 = response.data.intro;
                        if( response.data.deadline === '' ){
                            vm.detail.demandDeadline        = demandDeadlineObj.longtime.value;
                        }else{
                            vm.detail.demandDeadline        = demandDeadlineObj.deadTime.value;
                            vm.detail.demandDeadlineTime    = response.data.deadline*1000;
                        }
                    }else{
                        alert( '发生错误，请联系管理员' );
                        console.log( response );
                    }
                });
            }
        }

        /**
         * 发布需求
         */
        function saveDemand(){
            if( validateTitle() && validateTags() && validateIntro() && validateLinkman() && validateContact() ){
                var deadlineValidateResult = true,
                    demandPriceValidateResult = true;
                if( vm.detail.demandDeadline === demandDeadlineObj.deadTime.value  ){
                    deadlineValidateResult = validateDeadline(); 
                }
                if( vm.detail.demandPriceType === demandPriceTypeObj.charge.value ){
                    demandPriceValidateResult = validateDemandPrice();
                }
                if( deadlineValidateResult && demandPriceValidateResult ){
                    var toBeSavedDemand = {
                        title       : vm.detail.title,
                        tags        : vm.detail.tags,
                        category    : vm.detail.category,
                        contact     : vm.detail.contact,
                        priceType   : vm.detail.demandPriceType,
                        intro       : vm.detail.intro,
                        linkman     : vm.detail.linkman,
                    };
                    if( typeof $stateParams.demandId !== 'undefined' ){
                        toBeSavedDemand.demandId = $stateParams.demandId;
                    }

                    if( toBeSavedDemand.priceType === demandPriceTypeObj.charge.value ){
                        toBeSavedDemand.cost    = vm.detail.cost;
                    }
                    // 如果不传递则表示是长期有效
                    if( vm.detail.demandDeadlineTime !== "" ){
                        toBeSavedDemand.deadline = new Date( vm.detail.demandDeadlineTime ).getTime()/1000;
                    }
                    //console.log( toBeSavedDemand );

                    MyDemandFactory.saveDemand( toBeSavedDemand )
                    .then( function( response ){
                        if( response.errorCode === errorCode.SUCCESS ){
                            $state.go( 'userCenter.my_demand' );
                        }else{
                            var modalInstance = $uibModal.open({
                                animation       : true,
                                templateUrl     : '/components/poplayer/poplayer.normal.html',
                                controller      : 'poplayerNormalCtrl',
                                controllerAs    : 'vm',
                                resolve         : {
                                    popInData   : function(){
                                        return {
                                            showCancel  : false,
                                            okBtnTheme  : 'red',
                                            popMsg      : '保存失败，请稍后再试' 
                                        };
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }

        /**
         * 验证标题
         */
        function validateTitle(){
            if( vm.detail.title === '' || vm.detail.title.length >= defaults.dataTitleLimit ){
                vm.error.title.flag = true;
                return false;
            }else{
                vm.error.title.flag = false;
                return true;
            }
        }

        /**
         * 验证标签
         */
        function validateTags(){
            var tags = vm.detail.tags;
            if( tags.length === 0 ){
                vm.error.tags.flag = true;
                return false;
            }else{
                vm.error.tags.flag = false;
                return true;
            }
        }

        /**
         * 验证悬赏定价
         */
        function validateDemandPrice(){
            if( typeof vm.detail.cost === 'undefined' ){
                vm.error.demandPrice.flag = true;
                return false;
            }
            var cost = Number( vm.detail.cost.trim() );
            if( _.isNaN( cost ) || cost === 0 ){
                vm.error.demandPrice.flag = true;
                return false;
            }else{
                vm.error.demandPrice.flag = false;
                return true;
            }
        }
        
        /**
         * 验证日期
         */
        function validateDeadline(){
            if( typeof vm.detail.demandDeadlineTime === 'undefined' ){
                vm.error.deadline.flag = true;
                return false;
            }
            var deadline = Number( vm.detail.demandDeadlineTime );
            if( deadline > 0 ){
                vm.error.deadline.flag = false;
                return true;
            }else{
                vm.error.deadline.flag = true;
                return false;
            }
        }

        /**
         * 验证定制详述
         */
        function validateIntro(){
            var intro = vm.detail.intro.trim();
            if( intro.length === 0 || intro.length > 300 ){
                vm.error.intro.flag = true;
                return false;
            }else{
                vm.error.intro.flag = false;
                return true;
            }
        }
        
        /**
         * 验证联系人
         */
        function validateLinkman(){
            var linkman = vm.detail.linkman.trim();
            if( linkman.length === 0 ){
                vm.error.linkman.flag = true;
                return false;
            }else{
                vm.error.linkman.flag = false;
                return true;
            }
        }

        /**
         * 验证联系方式
         */
        function validateContact(){
            var contact = vm.detail.contact.trim();
            if( contact.length === 0 ){
                vm.error.contact.flag = true;
                return false;
            }else{
                vm.error.contact.flag = false;
                return true;
            }
        }

    }

})();
