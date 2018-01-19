(function(){
	'use strict';

	angular
		.module('Datatao.qualityData')
		.factory('QualityDataFactory',QualityDataFactory);

		QualityDataFactory.$inject = ['$http'];
		

		/*精品数据factory*/
		function QualityDataFactory($http){
			return {
				getList : getList
			};

			/**
			 * 获取列表数据
			 * @param  {[type]} params [description]
			 * @return {[type]}        [description]
			 */
			function getList(params){
				return $http.get('/v3/api/data/quality',{
					params:params
				})
				.then(function(response){
					return response.data;
				});
			}

			/*function getList(params){
				return $http.get('/v3/api/data/search',{
					params:params
				})
				.then(function(response){
					return response.data;
				});
			}*/
		}
})();
