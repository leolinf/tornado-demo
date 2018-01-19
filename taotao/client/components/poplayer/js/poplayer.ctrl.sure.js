;(function(){
	'use strict';
	angular
		.module('Datatao.poplayer')
		.controller('poplayerSureCtrl',poplayerSureCtrl);
		poplayerSureCtrl.$inject = ['$uibModalInstance','$state'];
		function poplayerSureCtrl($uibModalInstance, $state){
			/*jshint validthis:true*/
			var vm = this;
			vm.ok = ok;
			function ok(){
				$state.go('home');
            	$uibModalInstance.dismiss('cancel');
        	}
		}
})();
