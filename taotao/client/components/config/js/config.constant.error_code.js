/**
 * 定义错误码
 */
;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'errorCode', {
            SUCCESS                 : 10000,    // 成功
            INVALID_ID              : 10001,    //
            PARAM_MISSING           : 10002,    //
            INVALID_TYPE            : 10003,    //
            ALREADY_EXISTS          : 10004,    //
            INVALID_USER            : 10005,    // 无效的用户名或密码
            PERMISSION_DENIED       : 10006,    //
            NOT_MATCH               : 10011,    //
            INVALID_VERIFY_CODE     : 10012,    //
            NEED_REFRESH            : 10024,    //
            NOT_EXISTS              : 10030,    //
            TOO_FREQUENT            : 10031,    //
            WAIT_TOMORROW           : 10032,    //
            USER_BLOCKED            : 10033,    //
            INVALID_IMAGE_CODE      : 10034,    //
            UNABLE_REVIEW           : 10049,    //
            UNABLE_EDIT             : 10050,    //
            UNABLE_OFFLINE          : 10051,    //
            USER_EMPTY              : 10052,    //
            COST_ERROR              : 10053,    //
            SYSTEMERROR             : 20000     // 系统错误
        });

})();
