;(function(){
    'use strict';

    angular
        .module( 'Datatao', [
            'ui.router',
            'ui.bootstrap',
            'LocalStorageModule',
            'ngRap',
            'Datatao.config',
            'Datatao.bootstrap',
            'Datatao.account',
            'Datatao.data',
            'Datatao.demand',
            'Datatao.header',
            'Datatao.detail',
            'Datatao.footer',
            'Datatao.signin',
            'Datatao.userCenter',
            'Datatao.poplayer',
            'ZS.select',
            'ZS.tag',
            'ZS.catstring',
            'ZS.checkbox',
            'ZS.radio',
            'ZS.verifycode',
            'ZS.uploadqiniu',
            'Datatao.pagination',
            'Datatao.qualityData',
            'Datatao.others',
            'Datatao.helper',
            'Datatao.platformFeature',
        ]);
})();
