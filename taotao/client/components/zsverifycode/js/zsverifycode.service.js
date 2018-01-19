;(function(){
    'use strict';

    angular
        .module( 'ZS.verifycode' )
        .factory( 'VerifycodeImgFactory', VerifycodeImgFactory );

    VerifycodeImgFactory.$inject = [ '$http' ];

    function VerifycodeImgFactory( $http ){
        return {
            getVerifycodeImg : getVerifycodeImg,
            verifyCode : verifyCode,
            sendCode : sendCode
        };

        /**
         * 获取验证码图片
         * @param {Object} [paramsObj] - 可选参数，获取图形验证码时传递给后端的参数
         * @param {String} paramsObj.key
         */
        function getVerifycodeImg( paramsObj ){
            return $http.get( '/v3/api/imgCode/', paramsObj )
            .then( function( res ){
                return res.data;
            }, function( res ){
                return res;
            });
        }

        /**
         * 验证用户输入的图形验证码
         * @param {Object} paramsObj - 验证用户输入的图形验证码时传递给后端的参数
         * @param {String} paramsObj.key - 获取验证码时候获取到的验证码图片内容，是base64编码的数据流
         * @param {String} paramsObj.img_code - 用户输入的验证码值
         */
        function verifyCode( paramsObj ){
            return $http.post( '/v3/api/imgCode/check', paramsObj )
            .then( function( res ){
                return res.data;
            }, function( res ){
                return res;
            });
        }

        /**
         * 向用户提供的用户名（手机或者邮箱）发送验证码
         */
        function sendCode( paramsObj ){
            return $http.get( '/v3/api/verifyCode', {
                params : paramsObj 
            })
            .then( function( res ){
                return res.data;
            }, function( res ){
                return res;
            });
        }
    }
})();
