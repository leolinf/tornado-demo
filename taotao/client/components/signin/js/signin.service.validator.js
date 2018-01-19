;(function(){
    'use strict';

    angular
        .module( 'Datatao.signin' )
        .factory( 'SigninValidatorFactory', SigninValidatorFactory );

    SigninValidatorFactory.$inject = [ '_' ];

    function SigninValidatorFactory(  _ ){
        return {
            validateUsername        : validateUsername,
            validatePassword        : validatePassword,
        };

        /**
         * 验证手机号码
         * @param {string} mobilePhone  - 待验证手机号码
         */
        function validateMobilePhone( mobilePhone ){
            var phoneNumber = Number( mobilePhone.trim() ),
                reg         = /^1[3456789]\d{9}$/;
            if( _.isNaN( phoneNumber ) || !reg.test( phoneNumber ) ){
                return false;
            }else{
                return true;
            }
        }

        /**
         * 验证邮箱
         * @param {string} email    - 带验证的邮箱
         */
        function validateEmail( email ){
            var emailStr    = email.trim(),
                reg         = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; 

            if( reg.test( emailStr ) ){
                return true;
            }else{
                return false;
            }
        }

        /**
         * 验证用户名
         * @param {string} username - 待验证的用户名
         */
        function validateUsername( username ){
            if( validateMobilePhone( username ) || validateEmail( username ) ){
                return true;
            }else{
                return false;
            }
        }

        /**
         * 验证密码
         * @param {string} password - 待验证的密码
         */
        function validatePassword( password ){
            var reg = /^[0-9a-zA-Z]{6,30}$/;
            if( reg.test( password.trim() ) ){
                return true;
            }else{
                return false;
            }
        }

    }
})();
