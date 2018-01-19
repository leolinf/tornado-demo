(function(){
    'use strict';

    angular
        .module( 'Datatao.signin' )
        .controller( 'signinCtrl', signinCtrl );
    
    signinCtrl.$inject = [ 'SigninFactory', 'SigninValidatorFactory', 'errorCode', 'localStorageService', '$state', '$rootScope', '$location' ];

    function signinCtrl( SigninFactory, SigninValidatorFactory, errorCode, localStorageService, $state, $rootScope, $location ){
        // jshint validthis : true
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);

        vm.signin       = signin;
        vm.username     = "";
        vm.password     = "";
        vm.isSignining  = false;

        vm.error = {
            username    : {
                flag    : false,
                msg     : '用户名不能为空'
            },
            password    : {
                flag    : false,
                msg     : '密码不能为空'
            }
        };

        active();

        function active(){
        }

        /**
         * 用户登录
         */
        function signin(){
            if( !SigninValidatorFactory.validateUsername( vm.username ) ){
                vm.error.username.flag  = true;
                vm.error.username.msg   = '用户名不正确';
                return false;
            }else{
                vm.error.username.flag  = false;
                vm.error.username.msg   = '';
            }
            if( !SigninValidatorFactory.validatePassword( vm.password ) ){
                vm.error.password.flag  = true;
                vm.error.password.msg   = '密码不正确';
                return false;
            }else{
                vm.error.password.flag  = false;
                vm.error.password.msg   = '';
            }
            vm.isSignining  = true;
            SigninFactory.getToken({
                username    : vm.username,
                password    : vm.password
            })
            .then( function( response ){
                vm.isSignining  = false;
                if( response.errorCode === errorCode.SUCCESS ){
                    localStorageService.set('token', response.data.token );
                    localStorageService.set( 'user', SigninFactory.getUserFromToken() );
                    if( $rootScope.prevState && $rootScope.prevState.name !== '' && $rootScope.prevState.name !== 'signup' && $rootScope.prevState.name !== 'forgerPassword' ){
                        $state.go( $rootScope.prevState, $rootScope.prevStateParams );
                    }else{
                        $state.go( 'home' );
                    }
                }else if( response.errorCode === errorCode.INVALID_USERNAME_OR_PASSWORD ){
                    vm.error.password.flag  = true;
                    vm.error.password.msg   = '用户名或密码错误';
                }else{
                    alert( '请联系管理员' );
                }
            });
        }
    }
})();
