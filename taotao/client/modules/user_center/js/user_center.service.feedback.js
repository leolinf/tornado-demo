;(function(){
	'use strict';

	angular
		.module('Datatao.userCenter')
		.factory('UserCenterFeedbackFactory',UserCenterFeedbackFactory);

		UserCenterFeedbackFactory.$inject = ['$http'];
		function UserCenterFeedbackFactory($http){
			return {
				submitFeedback : submitFeedback
			};

			/**
			 * 向后台提交意见反馈
			 * @param  {[type]} params [description]
			 * @return {[type]}        [description]
			 */
			function submitFeedback(params){
				return $http.post('/v3/api/user/message',params)
				// return $http.post('/v3/api/user/message')
				.then(function(response){
					return response.data;
				});
			}
		}
})();