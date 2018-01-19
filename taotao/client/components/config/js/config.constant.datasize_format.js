;(function(){
    'use strict';

    angular
        .module( 'Datatao.config' )
        .constant( 'dataSizeFormatArr', [
            {
                'name'  : 'B',
                'value' : 1
            },
            {
                'name'  : 'KB',
                'value' : 2
            },
            {
                'name'  : 'MB',
                'value' : 3
            },
            {
                'name'  : 'GB',
                'value' : 4
            },
            {
                'name'  : 'TB',
                'value' : 5
            },
        ])
        .constant( 'dataSizeFormatObj', {
            Bytes       : {
                value   : 1,
                name    : 'B'
            },
            KiloBytes   : {
                value   : 2,
                name    : 'KB'
            },
            MebiBytes   : {
                value   : 3,
                name    : 'MB'
            },
            GigaBytes   : {
                value   : 4,
                name    : 'GB'
            },
            TeraBytes   : {
                value   : 5,
                name    : 'TB'
            }
        })
        .constant( 'dataSizeFormatReverseObj', {
            1   : {
                name    : 'B'
            },
            2   : {
                name    : 'KB'
            },
            3   : {
                name    : 'MB'
            },
            4   : {
                name    : 'GB'
            },
            5   : {
                name    : 'TB'
            }
        });

})();
