(function(){
    'use strict';

    angular
        .module( 'Datatao.account' )
        .controller( 'signupCtrl', signupCtrl );
    
    signupCtrl.$inject = [ 'AccountFactory', 'errorCode', 'AccountValidatorFactory', 'verifyCodeTypeObj', '$uibModal', '$state', '$location' ];

    function signupCtrl( AccountFactory, errorCode, AccountValidatorFactory, verifyCodeTypeObj, $uibModal, $state, $location ){
        // jshint validthis: true
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);

        vm.info = {
            username            : "",
            password            : "",
            passwordConfirm     : "",
            verifyCode          : "",
            agreeProtocol       : 1             // 0,1分别表示没同意和已同意
        };

        vm.verifyCodeParams = {
            key             : '',
            waitTime        : 60,
            verifyCodeType  : verifyCodeTypeObj.signup.value
        };

        vm.error = {
            username        : {
                flag    : false,
                msg     : '用户名错误' 
            },
            password        : {
                flag    : false,
                msg     : '密码错误'
            },
            passwordConfirm : {
                flag    : false,
                msg     : '两次密码不一致'
            },
            verifyCode      : {
                flag    : false,
                msg     : '验证码不正确'
            },
            agreeProtocol   : {
                flag    : false,
                msg     : '请先阅读并同意注册协议'
            }
        };

        vm.signup               = signup;
        vm.validateUsername     = AccountValidatorFactory.validateUsername;

        /**
         * 用户注册
         */
        function signup(){
            if( AccountValidatorFactory.validateUsername( vm.info.username ) ){
                vm.error.username.flag  = false;
            }else{
                vm.error.username.flag = true;
                vm.error.username.msg   = '用户名错误';
                return false;
            }

            if( AccountValidatorFactory.validatePassword( vm.info.password ) ){
                vm.error.password.flag  = false;
            }else{
                vm.error.password.flag  = true;
                vm.error.password.msg   = '密码错误';
                return false;
            }

            if( AccountValidatorFactory.validatePasswordConfirm( vm.info.password, vm.info.passwordConfirm ) ){
                vm.error.passwordConfirm.flag = false;
            }else{
                vm.error.passwordConfirm.flag   = true;
                vm.error.passwordConfirm.msg    = '两次密码不一致';
                return false;
            }

            if( vm.info.agreeProtocol ){
                vm.error.agreeProtocol = false;
            }else{
                vm.error.agreeProtocol  = true;
                vm.error.agreeProtocol  = '请先阅读并同意注册协议';
                return false;
            }

            /*
            if( AccountValidatorFactory.validateVerifyCode( vm.info.VerifyCode ) ){
                vm.error.verifyCode.flag = false;
            }else{
                vm.error.verifyCode.flag = true;
                return false;
            }
            */

            var registryInfo = {
                username        : vm.info.username.trim(),
                password        : vm.info.password.trim(),
                passwordConfirm : vm.info.passwordConfirm.trim(),
                verifyCode      : vm.info.verifyCode.trim()
            };

            AccountFactory.signup( registryInfo )
            .then( function( response ){
                if( response.errorCode === errorCode.SUCCESS ){
                    var registerModalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/components/poplayer/poplayer.normal.html',
                        controller:'poplayerNormalCtrl',
                        controllerAs:'vm',
                        resolve: {
                            popInData : function(){
                                return {
                                    popMsg : '注册成功，是否马上登录？',
                                    okBtn : '是',
                                    cancelBtn : '否'
                                };
                            }
                        }
                    });
                    registerModalInstance.result.then( function( result ){
                        if( result.status ){
                            $state.go( 'signIn' );
                        }
                    });
                }else if( response.errorCode === errorCode.NOT_MATCH ){
                    vm.error.passwordConfirm.flag   = true;
                    vm.error.passwordConfirm.msg    = '两次密码不一致';
                }else if( response.errorCode === errorCode.INVALID_VERIFY_CODE ){
                    vm.error.verifyCode.flag    = true;
                    vm.error.verifyCode.msg     = '验证码不正确';
                }else if( response.errorCode === errorCode.ALREADY_EXISTS ){
                    vm.error.username       = true;
                    vm.error.username.msg   = '用户名已存在';
                }else{
                    alert( '请联系管理员' );
                }
            });
        }

    }

})();
