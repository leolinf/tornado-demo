;(function(){
    'use strict';

    angular
        .module( 'Datatao.platformFeature' )
        .controller( 'platformFeatureCtrl', platformFeatureCtrl );

    platformFeatureCtrl.$inject = [ '$location' ];

    function platformFeatureCtrl( $location ){
        // jshint validthis : true
        var vm = this; 

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);
    }
})();
