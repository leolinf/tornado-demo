(function(){
	'use strict';

	angular
		.module('Datatao.others')
		.controller('helpCenterCtrl',helpCenterCtrl);

    helpCenterCtrl.$inject = ['helpCenter','$stateParams', '$location' ];		

    /**
     * 帮助中心
     * @return {[type]} [description]
     */
    function helpCenterCtrl(helpCenter,$stateParams, $location ){
        //jshint validthis:true
        var vm = this;

        // 统计页面访问
        _hmt.push(['_trackPageview', $location.path() ]);

        vm.changTab = changTab;
        vm.helpCenter = helpCenter;

        //console.log("$stateParams.step:   "+$stateParams.step);
        vm.tabActive = parseInt(($stateParams.step==="" || typeof $stateParams.step === 'undefined')?(vm.helpCenter.step1.value):($stateParams.step));
        //console.log("vm.helpCenter.step1.value:   "+vm.helpCenter.step1.value);
        //console.log("vm.tabActive:    "+vm.tabActive);
        /**
         * 改变tab标签
         * @return {[type]} [description]
         */
        function changTab(value){
            vm.tabActive = value;
        }
    }

})();
