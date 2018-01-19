(function(){
    'use strict';

    angular
        .module( 'Datatao.account' )
        .controller( 'forgetPasswordCtrl', forgetPasswordCtrl );

    forgetPasswordCtrl.$inject = [ 'AccountFactory', 'AccountValidatorFactory', 'verifyCodeTypeObj', 'errorCode', '$location' ];

    function forgetPasswordCtrl( AccountFactory, AccountValidatorFactory, verifyCodeTypeObj, errorCode, $location ){
        // jshint validthis : true
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);

        vm.stepOne          = stepOne;
        vm.stepTwo          = stepTwo;
        vm.username         = "";
        vm.stepZeroSuccess  = true;
        vm.stepOneSuccess   = false;
        vm.stepTwoSuccess   = false;
        vm.stepThreeSuccess = false;
        vm.validateUsername = AccountValidatorFactory.validateUsername;

        vm.verifyCodeParams = {
            key             : '',
            waitTime        : 60,
            verifyCodeType  : verifyCodeTypeObj.resetPassword.value
        };

        vm.error = {
            username        : {
                flag    : false,
                msg     : '用户名不正确'
            },
            verifyCode      : {
                flag    : false,
                msg     : '验证码不正确'
            },
            password        : {
                flag    : false,
                msg     : '密码不正确'
            },
            passwordConfirm : {
                flag    : false,
                msg     : '确认密码不正确'
            }
        };

        /**
         * 忘记密码第一步
         */
        function stepOne(){
            AccountFactory.resetPasswordStepOne({
                username    : vm.username,
                verifyCode  : vm.verifyCode
            })
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.stepOneSuccess = true;
                    vm.accessToken   = response.data.accessToken;
                }else if( response.errorCode === errorCode.INVALID_VERIFY_CODE ){
                    vm.error.verifyCode.flag  = true;
                    vm.error.verifyCode.msg   = '无效的验证码';
                }else{
                    alert( response.errorMsg );
                    console.log( response );
                }
            });
        }

        /**
         * 忘记密码第二步
         */
        function stepTwo(){
            if( AccountValidatorFactory.validatePassword( vm.password ) ){
                vm.error.password.flag  = false;
                vm.error.password.msg   = '';
            }else{
                vm.error.password.flag  = true;
                vm.error.password.msg   = '密码不符合要求';
                return false;
            }
            if( AccountValidatorFactory.validatePasswordConfirm( vm.password, vm.passwordConfirm ) ){
                vm.error.passwordConfirm.flag   = false;
                vm.error.passwordConfirm.msg    = '';
            }else{
                vm.error.passwordConfirm.flag   = true;
                vm.error.passwordConfirm.msg    = '两次输入密码不一致';
                return false;
            }
            AccountFactory.resetPasswordStepTwo({
                accessToken     : vm.accessToken,
                password        : vm.password,
                passwordConfirm : vm.passwordConfirm
            })
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    vm.stepTwoSuccess = true;
                }else if( response.errorCode === errorCode.INVALID_TYPE ){
                    vm.error.password.flag   = true;
                    vm.error.password.msg    = '密码不符合要求';
                }
            });
        }

    }

})();
