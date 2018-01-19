(function(){
    'use strict';

    angular
        .module( 'Datatao.account' )
        .factory( 'AccountFactory', AccountFactory );

    AccountFactory.$inject = [ '$http' ];

    function AccountFactory( $http ){
        return {
            signup                  : signup,
            resetPasswordStepOne    : resetPasswordStepOne,
            resetPasswordStepTwo    : resetPasswordStepTwo
        };

        /**
         * 用户注册
         * @param {Object} params           - 用户注册参数对象
         * @param {string} username         - 用户名
         * @param {string} password         - 密码
         * @param {string} passwordConfirm  - 确认密码
         * @param {string} verifyCode       - 验证码
         */
        function signup( params ){
            return $http.post( '/v3/api/user', params )
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 找回密码第一步
         */
        function resetPasswordStepOne( params ){
            return $http.get( '/v3/api/user/pwd/retrieve1', {
                params : params
            })
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 找回密码第二步
         */
        function resetPasswordStepTwo( params ){
            return $http.post( '/v3/api/user/pwd/retrieve2', params )
            .then( function( response ){
                return response.data;
            });
        }
    }

})();
