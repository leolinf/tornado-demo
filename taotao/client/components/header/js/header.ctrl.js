;(function(){
    'use strict';

    angular
        .module( 'Datatao.header' )
        .controller( 'headerCtrl', headerCtrl );

    headerCtrl.$inject = [ '$state' ];

    function headerCtrl( $state ){
        //jshint validthis : true
        var vm = this;
        vm.showCode = false;

        vm.showCodDetail = showCodDetail;

        vm.hideCodDetail = hideCodDetail;

        /**
         * 显示详细二维码
         * @return {[type]} [description]
         */
        function showCodDetail(){
            console.log("show");
            vm.showCode = true;
        }

        /**
         * 隐藏详细二维码
         */
        function hideCodDetail(){
            console.log("hide");
            vm.showCode = false;
        }

        //console.log( $state.$current );
    }
})();
