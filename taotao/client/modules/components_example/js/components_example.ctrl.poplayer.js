(function(){
    'use strict';

    angular 
        .module( 'Datatao.componentsExample' )
        .controller( 'componentsExamplePoplayerCtrl', componentsExamplePoplayerCtrl );

    componentsExamplePoplayerCtrl.$inject = [ '$uibModal' ];

    function componentsExamplePoplayerCtrl( $uibModal ){
        // jshint validthis : true
        var vm = this;

        vm.popLayer = popLayer;

        function popLayer(){
            var registerModalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/components/poplayer/poplayer.normal.html',
                controller:'poplayerNormalCtrl',
                controllerAs:'vm',
                resolve: {
                    popInData : function(){
                        return {
                            popMsg : '注册成功，是否马上登录？',
                            okBtn : '是',
                            cancelBtn : '否'
                        };
                    }
                }
            });
            registerModalInstance.result.then( function( result ){
                console.log( result );
            });
        }
    }
})();
