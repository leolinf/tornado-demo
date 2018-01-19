/**
 * 是否为样例数据
 */
(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'isSampleAttachmentObj', {
            no      : {
                value   : 0
            },
            yes     : {
                value   : 1
            }
        })
        .constant( 'isSampleAttachmentArr', [
            {
                name    : '是',
                value   : 1
            },
            {
                name    : '否',
                value   : 0
            }
        ]);
})();
