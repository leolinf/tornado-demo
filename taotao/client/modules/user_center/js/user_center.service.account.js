(function(){
    'use strict';

    angular
        .module( 'Datatao.userCenter' )
        .factory( 'UserCenterAccountFactory', UserCenterAccountFactory );

    UserCenterAccountFactory.$inject = [ '$http' ];

    function UserCenterAccountFactory( $http ){
        return {
            setAccount      : setAccount,
            changePassword  : changePassword,
            getUserInfo     : getUserInfo,
        };

        /**
         * 设置账户
         * @param {Object} params       - 设置账户信息的参数对象
         * @param {string} company      - 公司名称
         * @param {string} contact      - 联系方式
         * @param {number} contactType  - 联系方式类型
         * @param {number} customerType - 用户类型
         * @param {string} nickname     - 用户昵称
         */
        function setAccount( params ){
            return $http.post( '/v3/api/user/info', params )
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 修改密码
         * @param {Object} params           - 修改密码参数对象
         * @param {string} passwordOrig     - 原密码
         * @param {string} password         - 新密码
         * @param {string} passwordConfirm  - 确认新密码
         */
        function changePassword( params ){
            return $http.post( '/v3/api/user/pwd/change', params )
            .then( function( response ){
                return response.data;
            });
        }

        /**
         * 获取账户信息
         */
        function getUserInfo( params ){
            return $http.get( '/v3/api/user/info' )
            .then( function( response ){
                return response.data;
            });
        }
    }
})();
