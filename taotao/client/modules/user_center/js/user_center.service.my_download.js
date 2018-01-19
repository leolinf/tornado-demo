;(function(){
	'use strict';

	angular
		.module('Datatao.userCenter')
		.factory('MyDownloadFactory',MyDownloadFactory);

		MyDownloadFactory.$inject = ['$http'];
		
		function MyDownloadFactory($http){
			return {
				getMyDownloadList : getMyDownloadList
			};

			/**
			 * 获取我的下载列表
			 * @param  {[type]} params [description]
			 * @return {[type]}        [description]
			 */
			function getMyDownloadList(params){
				return $http.get('/v3/api/user/attachment',{
					params:params
				})
				.then(function(response){
					return response.data;
				});
			}
		}
})();
