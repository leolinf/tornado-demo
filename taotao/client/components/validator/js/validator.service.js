(function(){
    'use strict';

    angular
        .module( 'Datatao.validator' )
        .factory( 'ValidatorFactory', ValidatorFactory );

    ValidatorFactory.$inject = [ '_' ];

    function ValidatorFactory( _ ){
        return {
            validateMobilePhone : validateMobilePhone,
            validateEmail       : validateEmail
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
    }

})();
