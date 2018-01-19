/**
 * 用户修改密码
 */
(function(){
    'use strict';

    angular
        .module( 'Datatao.userCenter' )
        .controller( 'changePasswordCtrl', changePasswordCtrl );

    changePasswordCtrl.$inject = [ 'UserCenterAccountFactory', 'errorCode' ];

    function changePasswordCtrl( UserCenterAccountFactory, errorCode ){
        // jshint validthis : true
        var vm = this;

        vm.changePassword = changePassword;
        
        vm.password = {
            old         : '',
            new         : '',
            newConfirm  : ''
        };

        active();
        
        function active(){
        }

        /**
         * 修改密码
         */
        function changePassword(){

            var changePasswordParams = {
                passwordOrig    : vm.password.old,
                password        : vm.password.new,
                passwordConfirm : vm.password.newConfirm
            };

            UserCenterAccountFactory.changePassword( changePasswordParams )
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    alert( '修改密码成功' );
                    console.log( '修改密码成功' );
                }else{
                    console.log( response );
                }
            });
        }
    }
})();
