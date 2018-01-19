;(function(){
	'use strict';

	angular
		.module('Datatao.userCenter')
		.factory('MessageFactory',MessageFactory);

		MessageFactory.$inject = ['$http'];

		function MessageFactory($http){
			return{ 
				getMessageList : getMessageList,
			};

			//获取我的收藏列表
			function getMessageList(params){
				return $http.get(' /v3/api/user/message',{
					params:params
				})
				.then(function(response){
					return response.data;
				});
			}
		}
})();