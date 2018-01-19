(function(){
    'use strict';

    angular
        .module( 'Datatao.footer' )
        .directive( 'footerDirective', footerDirective );

    footerDirective.$inject = [];

    function footerDirective(){
        var directive = {
            restrict : 'EA',
            scope : {
            },
            templateUrl : '/components/footer/footer.tpl.html',
            link : link
        };

        return directive;

        function link( scope, element, attrs ){
        }
    }

})();
