;(function(){
    'use strict';
    angular
        .module( 'underscore', [] )
        .factory( '_', UnderscoreFactory );

    UnderscoreFactory.$inject = [ '$window' ];

    function UnderscoreFactory( $window ){
        return $window._;
    }

})();
