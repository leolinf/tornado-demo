/**
 * 用户发布和编辑数据
 */
(function(){
    'use strict';

    angular
        .module( 'Datatao.userCenter' )
        .controller( 'accountSetCtrl', accountSetCtrl );

    accountSetCtrl.$inject = [ 'UserCenterAccountFactory', 'customerTypeObj', 'customerTypeArr', 'contactTypeObj', 'contactTypeArr', 'errorCode' ];

    function accountSetCtrl( UserCenterAccountFactory, customerTypeObj, customerTypeArr, contactTypeObj, contactTypeArr, errorCode ){
        // jshint validthis : true
        var vm = this;

        vm.setAccount       = setAccount;

        vm.customerTypeObj      = customerTypeObj;
        vm.customerTypeArr      = customerTypeArr;
        vm.contactTypeObj       = contactTypeObj;
        vm.contactTypeArr       = contactTypeArr;

        vm.accountInfo = {
            contact         : '',
            contactType     : '',
            customerType    : '',
        };

        active();
        
        function active(){
            init();
        }

        /**
         * 初始化表单内容
         */
        function init(){
            vm.selectedCustomerType = customerTypeObj.personal.value;
            vm.selectedContactType  = contactTypeObj.phone.value;

            UserCenterAccountFactory.getUserInfo()
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.accountInfo.company = response.data.userInfo.company;
                    vm.selectedContactType = response.data.userInfo.contactType;
                    vm.selectedCustomerType = response.data.userInfo.customerType;
                    vm.accountInfo.nickname = response.data.userInfo.nickname;
                    vm.accountInfo.contact = response.data.userInfo.contact;
                    vm.accountInfo.username = response.data.userInfo.username;
                }else{
                    console.log( response );
                }
            });
        }

        /**
         * 设置账户信息
         */
        function setAccount(){
            var setAccountParams = {
                contact         : vm.accountInfo.contact,
                contactType     : vm.selectedContactType,
                customerType    : vm.selectedCustomerType,
            };

            if( vm.selectedCustomerType === customerTypeObj.personal.value ){
                setAccountParams.nickname = vm.accountInfo.nickname;
            }else if( vm.selectedCustomerType === customerTypeObj.company.value ){
                setAccountParams.company = vm.accountInfo.company;
            }

            UserCenterAccountFactory.setAccount( setAccountParams )
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    console.log( '修改成功' );
                }else{
                    console.log( response );
                }
            });
        }
    }
})();
