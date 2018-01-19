(function(){
    'use strict';

    angular 
        .module( 'Datatao.componentsExample' )
        .controller( 'componentsExampleZsselectCtrl', componentsExampleZsselectCtrl );

    componentsExampleZsselectCtrl.$inject = [];

    function componentsExampleZsselectCtrl(){
        // jshint validthis : true
        var vm = this;

        vm.dropdown1 = 1;
        vm.dropdown2 = 2;
    }
})();
