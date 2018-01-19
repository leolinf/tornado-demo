;(function(){
    'use strict';

    angular
        .module( 'Datatao.account' )
        .factory( 'AccountValidatorFactory', AccountValidatorFactory );

    AccountValidatorFactory.$inject = [ '_' ];

    function AccountValidatorFactory( _ ){
        return {
            validateMobilePhone     : validateMobilePhone,
            validateEmail           : validateEmail,
            validateUsername        : validateUsername,
            validatePassword        : validatePassword,
            validatePasswordConfirm : validatePasswordConfirm,
            validateVerifyCode      : validateVerifyCode,
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

        /**
         * 确认密码验证
         * @param {string} password         - 待验证的密码
         * @param {string} passwordConfirm  - 待验证的确认密码
         */
        function validatePasswordConfirm( password, passwordConfirm ){
            if( validatePassword( password ) && password.trim() === passwordConfirm.trim() ){
                return true;
            }else{
                return false;
            }
        }

        /**
         * 验证验证码
         * @param {string} verifyCode   - 待验证的验证码
         */
        function validateVerifyCode( verifyCode ){
            var verifyCodeNumber    = Number( verifyCode ),
                reg                 = /^\d{6}$/;
    
            if( _.isNaN( verifyCodeNumber ) || !reg.test( verifyCodeNumber ) ){
                return false;
            }else{
                return true;
            }
        }
    }

})();
