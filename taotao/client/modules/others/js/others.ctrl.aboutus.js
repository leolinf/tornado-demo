;(function(){
    'use strict';

    angular
        .module( 'Datatao.others' )
        .controller( 'aboutusCtrl', aboutusCtrl );

    aboutusCtrl.$inject = [ '$location' ];

    function aboutusCtrl( $location ){
        // jshint validthis : true
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);
    }
})();
